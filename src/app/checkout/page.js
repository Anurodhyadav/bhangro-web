"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/utils/firebase";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Upload, ArrowLeft, ShieldCheck, CreditCard, Building2, Smartphone } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, isLoaded } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Nepal",
    address: "",
    apartment: "",
    city: "",
    district: "Kathmandu",
    phone: "",
    email: "",
    notes: "",
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState("");
  const [receiptError, setReceiptError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_esewa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setReceiptError("File size exceeds 2MB limit. Please upload a file under 2MB.");
        setReceiptFile(null);
        setReceiptFileName("");
        e.target.value = "";
        return;
      }
      setReceiptError("");
      setReceiptFile(file);
      setReceiptFileName(file.name);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.phone || !formData.email) {
      alert("Please fill in all required billing details.");
      return;
    }

    if (receiptError) {
      alert("Please select a valid payment receipt file (under 2MB).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare Order Document
      const orderPayload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName || "",
          country: formData.country,
          address: formData.address,
          apartment: formData.apartment || "",
          city: formData.city,
          district: formData.district,
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes || "",
        },
        items: cart.map((item) => ({
          productId: item.product.id || item.product.slug,
          slug: item.product.slug,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          itemTotal: item.product.price * item.quantity,
        })),
        subtotal: cartSubtotal,
        shipping: 0,
        total: cartSubtotal,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      // Write to Firestore `orders` collection
      const orderDocRef = await addDoc(collection(db, "orders"), orderPayload);
      const orderId = orderDocRef.id;

      // 2. Upload Payment Receipt to Firebase Storage if uploaded
      let uploadedReceiptUrl = "no_receipt_attached";
      if (paymentMethod === "bank_esewa" && receiptFile) {
        const cleanFileName = receiptFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const storageRef = ref(storage, `receipts/${orderId}/${Date.now()}_${cleanFileName}`);
        const snapshot = await uploadBytes(storageRef, receiptFile);
        uploadedReceiptUrl = await getDownloadURL(snapshot.ref);
      }

      // 3. Prepare Payment Document
      const paymentPayload = {
        orderId: orderId,
        receiptUrl: uploadedReceiptUrl,
        receiptFileName: receiptFileName || "Not uploaded",
        paymentMethod: paymentMethod === "bank_esewa" ? "Bank / eSewa Transfer" : "Cash on Delivery",
        status: "pending",
        createdAt: serverTimestamp(),
      };

      // Write to Firestore `payments` collection
      await addDoc(collection(db, "payments"), paymentPayload);

      // Save order info for confirmation view
      setOrderSuccess({
        id: orderId,
        customer: formData,
        items: cart,
        subtotal: cartSubtotal,
      });

      // Clear local cart
      clearCart();
    } catch (error) {
      console.error("Error submitting order to Firestore:", error);
      alert("Failed to place order. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-hemp-200 py-24 flex items-center justify-center">
          <p className="text-hemp-700">Loading checkout...</p>
        </main>
        <Footer />
      </>
    );
  }

  // Confirmation screen when order successfully saved to Firestore
  if (orderSuccess) {
    return (
      <>
        <Navbar />
        <main className="bg-hemp-200 min-h-screen py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-3xl bg-hemp-100/50 border border-hemp-200 p-8 sm:p-12 shadow-xl text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-rust-500/10 text-rust-600 flex items-center justify-center">
                <CheckCircle size={48} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rust-600">Order Placed</span>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-hemp-900">
                  Thank You For Your Order!
                </h1>
                <p className="mt-2 text-hemp-700 text-sm">
                  Your order has been recorded in our system. We will verify your payment and process shipment shortly.
                </p>
              </div>

              <div className="rounded-2xl  border border-hemp-200 p-6 text-left space-y-3 text-sm">
                <div className="flex justify-between border-b border-hemp-200 pb-3">
                  <span className="text-hemp-600">Order Reference ID:</span>
                  <span className="font-mono font-bold text-hemp-900">{orderSuccess.id}</span>
                </div>
                <div className="flex justify-between border-b border-hemp-200 pb-3">
                  <span className="text-hemp-600">Customer Name:</span>
                  <span className="font-bold text-hemp-900">
                    {orderSuccess.customer.firstName} {orderSuccess.customer.lastName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-hemp-200 pb-3">
                  <span className="text-hemp-600">Shipping Address:</span>
                  <span className="font-bold text-hemp-900 text-right">
                    {orderSuccess.customer.address}, {orderSuccess.customer.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-hemp-600">Total Amount:</span>
                  <span className="font-bold text-rust-600 text-lg">
                    Rs. {orderSuccess.subtotal.toLocaleString()}.00
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-hemp-800 px-8 py-3.5 text-sm font-semibold text-cream hover:bg-rust-600 transition"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-hemp-200 min-h-screen py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-medium text-hemp-700 hover:text-rust-600 transition-colors"
            >
              <ArrowLeft size={16} /> Return to Cart
            </Link>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-hemp-900 uppercase tracking-wide">
              Checkout Form
            </h1>
          </div>

          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Billing Details & Additional Info (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Billing & Shipping Section */}
              <div className="rounded-2xl bg-hemp-100/50 border border-hemp-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-hemp-900 tracking-wide uppercase border-b border-hemp-200 pb-4">
                  Billing & Shipping
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                      First Name <span className="text-rust-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Suman"
                      className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                      Last Name <span className="text-rust-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Shrestha"
                      className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Company name"
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                    Country / Region
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Nepal"
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200/50 px-4 py-2.5 text-sm font-semibold text-hemp-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                    Street Address <span className="text-rust-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number and street name"
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                    Apartment, suite, unit (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, etc."
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                      Town / City <span className="text-rust-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Kathmandu"
                      className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                      District <span className="text-rust-600">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                    >
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Chitwan">Chitwan</option>
                      <option value="Other">Other District</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                      Phone Number <span className="text-rust-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9813316996"
                      className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                      Email Address <span className="text-rust-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. name@example.com"
                      className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="rounded-2xl bg-hemp-100/50 border border-hemp-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-hemp-900 tracking-wide uppercase border-b border-hemp-200 pb-4">
                  Additional Information
                </h2>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Notes about your order, e.g. special delivery instructions."
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Payment Section (5 Cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Your Order Summary Table */}
              <div className="rounded-2xl bg-hemp-100/50 border border-hemp-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-hemp-900 tracking-wide uppercase border-b border-hemp-200 pb-4">
                  Your Order
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-hemp-600 border-b border-hemp-200 pb-2">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-sm text-hemp-600">No items in cart.</p>
                  ) : (
                    cart.map(({ product, quantity }) => (
                      <div key={product.slug} className="flex justify-between items-center text-sm py-1">
                        <span className="text-hemp-800 font-medium">
                          {product.name} × {quantity}
                        </span>
                        <span className="font-bold text-hemp-900">
                          Rs. {(product.price * quantity).toLocaleString()}.00
                        </span>
                      </div>
                    ))
                  )}

                  <div className="border-t border-hemp-200 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-hemp-800">
                      <span>Subtotal</span>
                      <span className="font-bold">Rs. {cartSubtotal.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between text-hemp-800">
                      <span>Shipping</span>
                      <span className="text-rust-600 font-semibold">Free shipping</span>
                    </div>
                  </div>

                  <div className="border-t border-hemp-200 pt-3 flex justify-between text-lg font-bold text-hemp-900">
                    <span>Total Amount</span>
                    <span className="text-rust-600">Rs. {cartSubtotal.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              {/* Payment & Receipt Upload Section */}
              <div className="rounded-2xl bg-hemp-100/50 border border-hemp-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-hemp-900 tracking-wide uppercase border-b border-hemp-200 pb-4">
                  Payment Method
                </h2>

                {/* Radio Options */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-hemp-300 bg-hemp-200 cursor-pointer hover:border-rust-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_esewa"
                      checked={paymentMethod === "bank_esewa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-rust-500"
                    />
                    <div>
                      <span className="block font-bold text-sm text-hemp-900">
                        Bank / eSewa Transfer
                      </span>
                      <span className="block text-xs text-hemp-600 mt-0.5">
                        Direct transfer via bank or eSewa app.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl border border-hemp-300 bg-hemp-200 cursor-pointer hover:border-rust-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-rust-500"
                    />
                    <div>
                      <span className="block font-bold text-sm text-hemp-900">
                        Cash on Delivery
                      </span>
                      <span className="block text-xs text-hemp-600 mt-0.5">
                        Pay with cash upon package delivery in Nepal.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Static Bank & eSewa Transfer Details */}
                {paymentMethod === "bank_esewa" && (
                  <div className="rounded-xl border border-hemp-300 bg-hemp-200 p-5 space-y-4 text-xs">
                    <p className="text-hemp-800 leading-relaxed">
                      Please pay directly into our bank account or via e-Sewa, using your <strong>Order Name</strong> or <strong>Phone Number</strong> as reference.
                    </p>

                    <div className="space-y-3 border-t border-hemp-200 pt-3">
                      <div className="flex items-start gap-2.5">
                        <Building2 size={16} className="text-rust-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-hemp-900">Bank Transfer (Xyz Bank)</p>
                          <p className="text-hemp-700">Branch: Xyz Branch (Ph: 98xxxxxxxx)</p>
                          <p className="text-hemp-700">Account Name: <strong>Bhangro Bags</strong></p>
                          <p className="text-hemp-700">Account No: <strong>01xxxxxxxxxxxxxx</strong></p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 border-t border-hemp-200 pt-3">
                        <Smartphone size={16} className="text-rust-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-hemp-900">eSewa Wallet</p>
                          <p className="text-hemp-700">Account Name: <strong>Bhangro Bags</strong></p>
                          <p className="text-hemp-700">eSewa ID / Phone: <strong>98xxxxxxxx</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* File Upload Box */}
                    <div className="pt-2 border-t border-hemp-200">
                      <label className="block font-bold text-hemp-900 mb-1.5">
                        Upload Payment Receipt (Screenshot or PDF)
                      </label>
                      <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer ${receiptError ? "border-red-500 bg-red-500/10" : "border-hemp-300 bg-hemp-200/50 hover:bg-hemp-100/50"}`}>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1.5">
                          <Upload size={20} className={receiptError ? "text-red-600" : "text-hemp-700"} />
                          <span className={`text-xs font-semibold ${receiptError ? "text-red-700 font-bold" : "text-hemp-800"}`}>
                            {receiptFileName ? receiptFileName : "Click or drag receipt file to upload"}
                          </span>
                          <span className="text-[10px] text-hemp-500">Formats: JPG, PNG, PDF (Max 2MB)</span>
                        </div>
                      </div>
                      {receiptError && (
                        <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                          <span>⚠️</span> {receiptError}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-hemp-800 px-8 py-4 text-base font-bold text-cream cursor-pointer uppercase tracking-wider shadow-lg hover:bg-rust-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck size={20} />
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

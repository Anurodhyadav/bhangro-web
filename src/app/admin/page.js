"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  ArrowLeft,
  ShieldCheck,
  Package,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/utils/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Backpacks",
    color: "",
    fabric: "",
    dimensions: "",
    volume: "",
    description: "",
    features: "",
  });

  // Images state for up to 3 images
  // Array of items: { type: 'existing' | 'new', url?: string, file?: File }
  const [imagesState, setImagesState] = useState([]);

  // Fetch Firestore products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(items);
    } catch (err) {
      console.error("Error fetching products:", err);
      // Fallback if index isn't created yet for orderBy
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = [];
        querySnapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        setProducts(items);
      } catch (e) {
        console.error("Fallback fetch failed:", e);
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "Backpacks",
      color: "Moss Green / Beige",
      fabric: "100% Wild Hemp & Heavy Cotton Canvas",
      dimensions: '17.25"(H) x 12"(W) x 6"(D)',
      volume: "21 L",
      description: "",
      features: "",
    });
    setImagesState([]);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price ? String(product.price) : "",
      category: product.category || "Backpacks",
      color: product.color || "",
      fabric: product.fabric || "",
      dimensions: product.dimensions || "",
      volume: product.volume || "",
      description: product.description || "",
      features: Array.isArray(product.features) ? product.features.join("\n") : "",
    });

    const existingImages = (product.images || []).map((url) => ({
      type: "existing",
      url,
    }));
    setImagesState(existingImages);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = 3 - imagesState.length;
    if (availableSlots <= 0) {
      setErrorMsg("Maximum 3 images per product allowed.");
      return;
    }

    const newFilesToAdd = files.slice(0, availableSlots).map((file) => ({
      type: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImagesState((prev) => [...prev, ...newFilesToAdd]);
    setErrorMsg("");
  };

  const handleRemoveImage = (index) => {
    setImagesState((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      setErrorMsg("Product Name and Price are required.");
      return;
    }

    if (imagesState.length === 0) {
      setErrorMsg("Please upload at least 1 image for the product.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const productId = editingProduct ? editingProduct.id : `prod_${Date.now()}`;
      const slug = formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const numericPrice = parseFloat(formData.price) || 0;
      const formattedPrice = `Rs. ${numericPrice.toLocaleString("en-IN")}.00`;
      const featuresList = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      // Upload any new images to Firebase Storage
      const uploadedImageUrls = [];
      for (let i = 0; i < imagesState.length; i++) {
        const item = imagesState[i];
        if (item.type === "existing") {
          uploadedImageUrls.push(item.url);
        } else if (item.type === "new" && item.file) {
          const timestamp = Date.now();
          const cleanFileName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storageRef = ref(storage, `products/${productId}/${timestamp}_${cleanFileName}`);
          const snapshot = await uploadBytes(storageRef, item.file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          uploadedImageUrls.push(downloadUrl);
        }
      }

      const productDocData = {
        id: productId,
        slug,
        name: formData.name.trim(),
        price: numericPrice,
        formattedPrice,
        category: formData.category,
        color: formData.color.trim(),
        fabric: formData.fabric.trim(),
        dimensions: formData.dimensions.trim(),
        volume: formData.volume.trim(),
        description: formData.description.trim(),
        features: featuresList,
        images: uploadedImageUrls,
        updatedAt: new Date().toISOString(),
      };

      if (!editingProduct) {
        productDocData.createdAt = new Date().toISOString();
      }

      const docRef = doc(db, "products", productId);
      await setDoc(docRef, productDocData, { merge: true });

      setSuccessMsg(editingProduct ? "Product updated successfully!" : "Product added successfully!");
      setIsFormOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setErrorMsg("Failed to save product. " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoadingProducts(true);
      // Delete document from Firestore
      await deleteDoc(doc(db, "products", product.id));

      // Attempt to clean up images from Storage if they originate from Firebase Storage
      if (Array.isArray(product.images)) {
        for (const imgUrl of product.images) {
          if (imgUrl.includes("firebasestorage.googleapis.com")) {
            try {
              const storageRef = ref(storage, imgUrl);
              await deleteObject(storageRef);
            } catch (storageErr) {
              console.warn("Storage deletion warning:", storageErr);
            }
          }
        }
      }

      setSuccessMsg(`"${product.name}" deleted.`);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product: " + err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-hemp-300 flex items-center justify-center p-6">
          <div className="flex items-center gap-3 text-hemp-900 font-medium">
            <Loader2 className="animate-spin" size={24} /> Loading authentication...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user || !isAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-hemp-300 py-20 px-6">
          <div className="mx-auto max-w-lg rounded-3xl bg-hemp-200 border border-hemp-200 p-8 shadow-xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle size={32} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-hemp-900">Admin Access Required</h1>
            <p className="text-sm text-hemp-700 leading-relaxed">
              You must be signed in with an Administrator account (`isAdmin: true`) to access the product management panel.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-hemp-900 px-6 py-3 text-sm font-semibold text-cream hover:bg-rust-600 transition"
              >
                <ArrowLeft size={16} /> Return to Home
              </Link>
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
      <main className="min-h-screen bg-hemp-300 py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-hemp-200 rounded-3xl p-6 sm:p-8 border border-hemp-200 shadow-sm mb-8">
            <div>
              <div className="flex items-center gap-2 text-rust-600 font-semibold text-xs uppercase tracking-wider">
                <ShieldCheck size={16} /> Admin Portal
              </div>
              <h1 className="mt-1 font-serif text-3xl font-bold text-hemp-900">
                Product Management
              </h1>
              <p className="mt-1 text-sm text-hemp-700">
                Create, update, and manage products stored in your Firebase collection.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rust-500 px-6 py-3 text-sm font-semibold text-cream hover:bg-rust-600 shadow-md transition"
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          {/* Feedback Alerts */}
          {successMsg && (
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-green-50 border border-green-200 p-4 text-sm font-medium text-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg("")} className="text-green-600 hover:text-green-800">
                <X size={16} />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-red-50 border border-red-200 p-4 text-sm font-medium text-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-red-600" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg("")} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Products List Table / Grid */}
          <div className="bg-hemp-200 rounded-3xl border border-hemp-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-hemp-200 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-hemp-900 flex items-center gap-2">
                <Package size={20} className="text-rust-600" /> Catalog Products ({products.length})
              </h2>
            </div>

            {loadingProducts ? (
              <div className="p-12 text-center text-hemp-700 flex justify-center items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Loading catalog items...
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <p className="text-hemp-700 font-medium">No products added yet.</p>
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 text-sm font-bold text-rust-600 hover:underline"
                >
                  <Plus size={16} /> Add your first product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-hemp-800">
                  <thead className="bg-hemp-100/50 text-xs uppercase font-bold text-hemp-700 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Product</th>
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-6">Price</th>
                      <th className="py-3.5 px-6">Images</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hemp-200">
                    {products.map((prod) => {
                      const mainImage = prod.images?.[0] || null;
                      return (
                        <tr key={prod.id} className="hover:bg-hemp-200/50 transition">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="relative h-14 w-14 flex-shrink-0 rounded-xl bg-hemp-100/50 overflow-hidden border border-hemp-200">
                                {mainImage ? (
                                  <Image
                                    src={mainImage}
                                    alt={prod.name}
                                    fill
                                    className="object-contain p-1"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-hemp-500">
                                    No img
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-serif font-bold text-hemp-900 text-base">
                                  {prod.name}
                                </h3>
                                <p className="text-xs text-hemp-600">ID: {prod.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-medium">
                            <span className="px-2.5 py-1 rounded-full bg-hemp-200 text-hemp-900 text-xs">
                              {prod.category || "General"}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-rust-600 font-sans">
                            {prod.formattedPrice || `Rs. ${prod.price}`}
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs text-hemp-700">
                              {prod.images?.length || 0} / 3 images
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-full bg-hemp-200 text-hemp-900 hover:bg-rust-500 hover:text-cream text-xs font-semibold transition"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod)}
                              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-600 hover:text-cream text-xs font-semibold transition"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add / Edit Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hemp-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-hemp-200 border border-hemp-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-8">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-hemp-700 hover:text-hemp-900 p-1 rounded-full hover:bg-hemp-200"
            >
              <X size={20} />
            </button>

            <h2 className="font-serif text-2xl font-bold text-hemp-900 mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boulder Sack"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                  />
                </div>

                {/* Price (Numeric) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                    Price (NPR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="2750"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                  >
                    <option value="Backpacks">Backpacks</option>
                    <option value="Hip Packs">Hip Packs</option>
                    <option value="Side Bags">Side Bags</option>
                    <option value="Tote Bags">Tote Bags</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                    Color / Style
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Moss Green / Beige"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                  />
                </div>

                {/* Fabric */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                    Fabric
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Wild Hemp"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    placeholder='e.g. 17.25"(H) x 12"(W) x 6"(D)'
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                  />
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                    Volume
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 21 L"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed description of the hemp product..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                />
              </div>

              {/* Features List */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                  Features (One feature per line)
                </label>
                <textarea
                  rows={4}
                  placeholder={"Padded laptop compartment\nDrawstring closure\nAir mesh shoulder padding"}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full rounded-xl border border-hemp-300 bg-hemp-200 px-4 py-2.5 text-sm text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500"
                />
              </div>

              {/* Image Upload Section (Max 3) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-hemp-800 mb-1">
                  Product Images (Max 3) *
                </label>
                <p className="text-xs text-hemp-600 mb-3">
                  Upload images to Firebase Storage. Up to 3 images allowed per product.
                </p>

                {/* Images Preview Row */}
                <div className="flex flex-wrap gap-4 mb-3">
                  {imagesState.map((img, idx) => {
                    const src = img.type === "existing" ? img.url : img.previewUrl;
                    return (
                      <div
                        key={idx}
                        className="relative w-24 h-24 rounded-2xl bg-hemp-100/50 border border-hemp-300 overflow-hidden shadow-sm flex items-center justify-center group"
                      >
                        <Image
                          src={src}
                          alt={`Upload preview ${idx + 1}`}
                          fill
                          className="object-contain p-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-cream p-1 rounded-full opacity-90 hover:opacity-100 shadow"
                          title="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}

                  {imagesState.length < 3 && (
                    <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-hemp-400 bg-hemp-100/50 hover:bg-hemp-100 flex flex-col items-center justify-center text-hemp-700 cursor-pointer transition">
                      <Upload size={20} className="mb-1 text-rust-600" />
                      <span className="text-[10px] font-bold uppercase">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hemp-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full px-6 py-2.5 text-sm font-semibold cursor-pointer text-hemp-700 hover:bg-hemp-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-hemp-800 px-7 py-2.5 text-sm font-semibold text-cream hover:bg-rust-600 disabled:opacity-50 transition"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {saving ? "Saving Product..." : editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

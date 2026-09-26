"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-hemp-200 py-24 flex items-center justify-center">
          <div className="text-hemp-700 font-medium">Loading cart...</div>
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
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-hemp-200">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-hemp-900">Your Shopping Cart</h1>
              <p className="text-hemp-700 text-sm mt-1">Review your selected items before proceeding to checkout</p>
            </div>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-hemp-800 hover:text-rust-600 transition"
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-hemp-100 flex items-center justify-center text-hemp-700">
                <ShoppingBag size={36} />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-hemp-900">Your cart is empty</h2>
                <p className="text-hemp-700 mt-2 max-w-md mx-auto text-sm">
                  Explore our authentic hemp collection handmade in Nepal and find something special.
                </p>
              </div>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 rounded-full bg-hemp-900 px-8 py-3.5 text-sm font-semibold text-cream hover:bg-rust-600 transition"
              >
                Browse Collection <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Items List (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="divide-y divide-hemp-200 border-t border-b border-hemp-200">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.slug} className="py-6 flex flex-col sm:flex-row items-center gap-6">
                      {/* Image Thumbnail */}
                      <div className="relative w-24 h-24 rounded-xl bg-hemp-100/50 border border-hemp-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-serif text-lg font-bold text-hemp-900 hover:text-rust-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs font-semibold text-rust-600 mt-0.5">{product.category}</p>
                        <p className="text-sm font-semibold text-hemp-800 mt-1 sm:hidden">
                          {product.formattedPrice}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-hemp-300 bg-hemp-100/50">
                          <button
                            onClick={() => updateQuantity(product.slug, quantity - 1)}
                            className="p-2 text-hemp-800 hover:text-rust-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-hemp-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.slug, quantity + 1)}
                            className="p-2 text-hemp-800 hover:text-rust-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove Item Button */}
                        <button
                          onClick={() => removeFromCart(product.slug)}
                          className="p-2 text-hemp-500 hover:text-rust-600 transition"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right hidden sm:block min-w-[100px]">
                        <p className="text-base font-bold text-hemp-900">
                          Rs. {(product.price * quantity).toLocaleString()}.00
                        </p>
                        <p className="text-xs text-hemp-600">
                          {product.formattedPrice} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={clearCart}
                    className="text-xs font-medium text-hemp-600 hover:text-rust-600 underline"
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>

              {/* Order Summary Box (4 Cols) */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl bg-hemp-100/50 border border-hemp-200 p-6 space-y-6 shadow-sm sticky top-28">
                  <h2 className="font-serif text-xl font-bold text-hemp-900">Order Summary</h2>

                  <div className="space-y-3 text-sm border-b border-hemp-200 pb-4">
                    <div className="flex justify-between text-hemp-800">
                      <span>Subtotal</span>
                      <span className="font-bold">Rs. {cartSubtotal.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between text-hemp-800">
                      <span>Standard Shipping</span>
                      <span className="text-rust-600 font-semibold">Calculated at Checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-hemp-900">
                    <span>Total Subtotal</span>
                    <span className="text-rust-600">Rs. {cartSubtotal.toLocaleString()}.00</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-hemp-900 px-6 py-3.5 text-base font-semibold text-cream shadow-md hover:bg-rust-600 transition-colors"
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </Link>

                  <p className="text-xs text-center text-hemp-600">
                    Taxes and shipping fees calculated during checkout. Secure payment via Bank Transfer or eSewa.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

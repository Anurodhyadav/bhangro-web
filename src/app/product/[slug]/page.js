"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const product = getProductBySlug(slug);
  const relatedProducts = getRelatedProducts(slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="font-serif text-3xl font-bold text-hemp-900">Product Not Found</h1>
          <p className="mt-4 text-hemp-700">The product you are looking for does not exist.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-hemp-800 px-6 py-3 text-sm font-semibold text-cream hover:bg-rust-600 transition"
          >
            <ArrowLeft size={18} /> Return to Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const currentImage = product.images[selectedImageIndex] || product.images[0];

  return (
    <>
      <Navbar />
      <main className="bg-hemp-300 min-h-screen py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-sm font-medium text-hemp-700 hover:text-rust-600 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Collection
            </Link>
          </div>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Product Images & Thumbnails (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl bg-hemp-50 border border-hemp-200 overflow-hidden shadow-sm flex items-center justify-center p-8">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-6 transition-all duration-300"
                />
              </div>

              {/* Thumbnails Row */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl bg-hemp-50 border-2 overflow-hidden flex-shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? "border-rust-500 ring-2 ring-rust-500/20 shadow-md"
                          : "border-hemp-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Specs (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rust-600">
                  {product.category}
                </span>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-hemp-900 uppercase tracking-wide">
                  {product.name}
                </h1>
                <p className="mt-2 text-2xl font-bold text-rust-600 font-sans">
                  {product.formattedPrice}
                </p>
              </div>

              {product.color && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-hemp-700">
                    Color / Style
                  </h4>
                  <p className="text-sm font-semibold text-hemp-900 mt-0.5">{product.color}</p>
                </div>
              )}

              <p className="text-hemp-800 leading-relaxed">{product.description}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-hemp-200 text-sm">
                <div>
                  <span className="block font-bold text-hemp-900">Dimensions</span>
                  <span className="text-hemp-700">{product.dimensions}</span>
                </div>
                <div>
                  <span className="block font-bold text-hemp-900">Volume</span>
                  <span className="text-hemp-700">{product.volume}</span>
                </div>
                <div>
                  <span className="block font-bold text-hemp-900">Fabric</span>
                  <span className="text-hemp-700">{product.fabric}</span>
                </div>
              </div>

              {/* Features List */}
              <div>
                <h3 className="font-serif text-lg font-bold text-hemp-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-hemp-800">
                      <CheckCircle2 size={18} className="text-rust-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-hemp-300 bg-cream">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-hemp-800 hover:text-rust-600 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-hemp-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-hemp-800 hover:text-rust-600 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-full bg-hemp-900 px-8 py-3.5 text-base font-semibold text-cream shadow-md hover:bg-rust-600 transition-colors"
                >
                  <ShoppingBag size={20} /> Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-24 border-t border-hemp-200 pt-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-hemp-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.slug}
                  href={`/product/${relProduct.slug}`}
                  className="group rounded-2xl bg-cream border border-hemp-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square w-full bg-hemp-50 p-6 flex items-center justify-center">
                    <Image
                      src={relProduct.images[0]}
                      alt={relProduct.name}
                      fill
                      className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <h3 className="font-serif text-lg font-bold text-hemp-900 group-hover:text-rust-600 transition-colors">
                      {relProduct.name}
                    </h3>
                    <p className="mt-2 font-bold text-rust-600">{relProduct.formattedPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

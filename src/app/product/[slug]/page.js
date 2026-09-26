"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug, getRelatedProducts, products as staticProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { db } from "@/utils/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function loadProduct() {
      setLoadingProduct(true);
      // 1. Try finding in static products
      const staticMatch = getProductBySlug(slug);
      if (staticMatch) {
        setProduct(staticMatch);
        setLoadingProduct(false);
        return;
      }

      // 2. Try finding in Firestore products by slug or id
      try {
        // Query by slug
        const q = query(collection(db, "products"), where("slug", "==", slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          setProduct({ id: snap.docs[0].id, ...docData });
          setLoadingProduct(false);
          return;
        }

        // Try direct doc ref by ID
        const docRef = doc(db, "products", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          setLoadingProduct(false);
          return;
        }
      } catch (err) {
        console.error("Error fetching product detail from Firestore:", err);
      }

      setProduct(null);
      setLoadingProduct(false);
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loadingProduct) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-24 text-center min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3 text-hemp-900 font-medium">
            <Loader2 className="animate-spin" size={24} /> Loading product details...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="font-serif text-3xl font-bold text-hemp-900">Product Not Found</h1>
          <p className="mt-4 text-hemp-700">The product you are looking for does not exist.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-hemp-800 px-6 py-3 text-sm font-semibold text-cream hover:bg-rust-600 transition"
          >
            <ArrowLeft size={18} /> Browse Collection
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

  const imagesList = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = imagesList[selectedImageIndex] || imagesList[0] || null;
  const relatedProducts = getRelatedProducts(slug);

  return (
    <>
      <Navbar />
      <main className="bg-hemp-300 min-h-screen py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-hemp-700 hover:text-rust-600 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Products
            </Link>
          </div>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Product Images & Thumbnails (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl bg-hemp-200 border border-hemp-200 overflow-hidden shadow-sm flex items-center justify-center p-8">
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain p-6 transition-all duration-300"
                  />
                ) : (
                  <div className="text-sm font-medium text-hemp-500">No Image</div>
                )}
              </div>

              {/* Thumbnails Row */}
              {imagesList.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl bg-hemp-200 border-2 overflow-hidden flex-shrink-0 transition-all ${
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
                  {product.category || "Hemp Bag"}
                </span>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-hemp-900 uppercase tracking-wide">
                  {product.name}
                </h1>
                <p className="mt-2 text-2xl font-bold text-rust-600 font-sans">
                  {product.formattedPrice || `Rs. ${product.price?.toLocaleString()}.00`}
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

              {product.description && (
                <p className="text-hemp-800 leading-relaxed">{product.description}</p>
              )}

              {/* Specs Grid */}
              {(product.dimensions || product.volume || product.fabric) && (
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-hemp-200 text-sm">
                  {product.dimensions && (
                    <div>
                      <span className="block font-bold text-hemp-900">Dimensions</span>
                      <span className="text-hemp-700">{product.dimensions}</span>
                    </div>
                  )}
                  {product.volume && (
                    <div>
                      <span className="block font-bold text-hemp-900">Volume</span>
                      <span className="text-hemp-700">{product.volume}</span>
                    </div>
                  )}
                  {product.fabric && (
                    <div>
                      <span className="block font-bold text-hemp-900">Fabric</span>
                      <span className="text-hemp-700">{product.fabric}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Features List */}
              {Array.isArray(product.features) && product.features.length > 0 && (
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
              )}

              {/* Quantity Selector & Add to Cart */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-hemp-300 bg-hemp-200">
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
          {relatedProducts.length > 0 && (
            <div className="mt-24 border-t border-hemp-200 pt-16">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-hemp-900 mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.slug}
                    href={`/product/${relProduct.slug}`}
                    className="group rounded-2xl bg-hemp-200 border border-hemp-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-square w-full bg-hemp-200 p-6 flex items-center justify-center">
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

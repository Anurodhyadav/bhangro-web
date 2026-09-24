"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  const backpackProduct = products.find((p) => p.slug === "boulder-sack") || products[0];
  const hipPackProduct = products.find((p) => p.slug === "fleek-hip-pack") || products[1];
  const rolltopProduct = products.find((p) => p.slug === "hemp-rolltop-backpack") || products[2];
  const sideBagProduct = products.find((p) => p.slug === "urban-side-bag") || products[3];

  return (
    <section id="products" className="bg-hemp-300 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-medium text-rust-600 tracking-wide uppercase text-xs">Handcrafted Collection</p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-hemp-900">
              Sustainable Hemp Gear
            </h2>
          </div>
          <Link
            href="#products"
            className="inline-flex items-center gap-2 font-medium text-hemp-800 hover:text-rust-600 transition-colors"
          >
            Explore all <ArrowRight size={18} />
          </Link>
        </div>

        {/* Collection Section Layout 1: Model on Left, 2 Products on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Large Lifestyle/Model Image (Left, 7 Cols) */}
          <div className="md:col-span-7 relative min-h-[380px] sm:min-h-[480px] rounded-2xl overflow-hidden shadow-lg group">
            <Image
              src={backpackProduct.lifestyleImage}
              alt={`${backpackProduct.name} lifestyle`}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hemp-900/70 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 text-cream">
              <span className="inline-block px-3 py-1 bg-rust-500 text-xs font-semibold uppercase tracking-wider rounded-full mb-2">
                Featured Gear
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{backpackProduct.name}</h3>
              <p className="text-hemp-100 text-sm mt-1">{backpackProduct.description}</p>
              <Link
                href={`/product/${backpackProduct.slug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream text-hemp-900 px-5 py-2.5 text-sm font-semibold hover:bg-rust-500 hover:text-cream transition-colors"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 2 Product Cards Stacked (Right, 5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-8 justify-between">
            {[backpackProduct, hipPackProduct].map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="group relative flex-1 min-h-[220px] rounded-2xl bg-cream border border-hemp-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative w-full h-full min-h-[220px] flex items-center justify-center p-6">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-all duration-300 group-hover:opacity-20 group-hover:scale-105"
                  />
                  {/* Hover Overlay with Name + Price */}
                  <div className="absolute inset-0 bg-cream/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-hemp-900 uppercase">
                      {product.name}
                    </h4>
                    <p className="mt-2 font-sans text-base font-semibold text-rust-600">
                      {product.formattedPrice}
                    </p>
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-hemp-700 underline decoration-rust-500 underline-offset-4">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Collection Section Layout 2: 2 Products on Left, Model on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* 2 Product Cards Stacked (Left, 5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-8 justify-between order-2 md:order-1">
            {[rolltopProduct, sideBagProduct].map((product) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="group relative flex-1 min-h-[220px] rounded-2xl bg-cream border border-hemp-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative w-full h-full min-h-[220px] flex items-center justify-center p-6">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-all duration-300 group-hover:opacity-20 group-hover:scale-105"
                  />
                  {/* Hover Overlay with Name + Price */}
                  <div className="absolute inset-0 bg-cream/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-hemp-900 uppercase">
                      {product.name}
                    </h4>
                    <p className="mt-2 font-sans text-base font-semibold text-rust-600">
                      {product.formattedPrice}
                    </p>
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-hemp-700 underline decoration-rust-500 underline-offset-4">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Large Lifestyle/Model Image (Right, 7 Cols) */}
          <div className="md:col-span-7 relative min-h-[380px] sm:min-h-[480px] rounded-2xl overflow-hidden shadow-lg group order-1 md:order-2">
            <Image
              src={hipPackProduct.lifestyleImage}
              alt={`${hipPackProduct.name} lifestyle`}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hemp-900/70 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 text-cream">
              <span className="inline-block px-3 py-1 bg-rust-500 text-xs font-semibold uppercase tracking-wider rounded-full mb-2">
                Active Lifestyle
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{hipPackProduct.name}</h3>
              <p className="text-hemp-100 text-sm mt-1">{hipPackProduct.description}</p>
              <Link
                href={`/product/${hipPackProduct.slug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream text-hemp-900 px-5 py-2.5 text-sm font-semibold hover:bg-rust-500 hover:text-cream transition-colors"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
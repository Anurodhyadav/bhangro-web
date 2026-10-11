"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product, priority = false }) {
  const mainImage = product.images?.[0] || null;
  const linkHref = `/product/${product.slug || product.id}`;

  return (
    <Link
      href={linkHref}
      className="group rounded-2xl bg-hemp-200 border border-hemp-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-hemp-200 p-6 flex items-center justify-center overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority}
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-hemp-500">
            No Image
          </div>
        )}
        {product.category && (
          <span className="absolute top-4 left-4 bg-rust-500 text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between bg-hemp-200">
        <div>
          <h3 className="font-serif text-xl font-bold text-hemp-900 group-hover:text-rust-600 transition-colors uppercase tracking-wide">
            {product.name}
          </h3>
          {product.color && (
            <p className="mt-1 text-xs text-hemp-600 font-medium">
              {product.color}
            </p>
          )}
          {product.description && (
            <p className="mt-2 text-xs text-hemp-700 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-hemp-100 pt-4">
          <span className="font-sans text-lg font-bold text-rust-600">
            {product.formattedPrice || `Rs. ${product.price?.toLocaleString()}.00`}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-hemp-800 group-hover:text-rust-600 transition-colors">
            <ShoppingBag size={14} /> View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

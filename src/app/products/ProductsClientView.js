"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpDown, ShoppingBag, Sparkles, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductsClientView({ initialProducts = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc | price-low | price-high
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Derive categories list dynamically
  const categories = useMemo(() => {
    const set = new Set();
    initialProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [initialProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by name (client-side)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "price-low") {
        return (a.price || 0) - (b.price || 0);
      } else if (sortBy === "price-high") {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });

    return result;
  }, [initialProducts, searchQuery, sortBy, selectedCategory]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-hemp-300 py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header Section */}
          <div className="mb-10 text-center sm:text-left flex flex-wrap items-end justify-between gap-6 border-b border-hemp-200 pb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rust-600">
                Explore All Products
              </p>
              <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-hemp-900">
                Full Collection
              </h1>
              <p className="mt-2 text-sm text-hemp-700 max-w-xl">
                Browse our complete catalog of sustainable, handcrafted wild hemp bags and accessories made in Nepal.
              </p>
            </div>
            <div className="text-xs font-semibold text-hemp-700 bg-hemp-200 border border-hemp-200 px-4 py-2 rounded-full shadow-sm">
              Showing {filteredProducts.length} of {initialProducts.length} items
            </div>
          </div>

          {/* Controls Bar: Search & Sort */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-6">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-hemp-600"
              />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-hemp-300 bg-hemp-200 pl-11 pr-4 py-3 text-sm text-hemp-900 placeholder-hemp-600 focus:outline-none focus:ring-2 focus:ring-rust-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-hemp-600 hover:text-hemp-900"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 2 && (
              <div className="md:col-span-3">
                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-hemp-600"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none rounded-full border border-hemp-300 bg-hemp-200 pl-10 pr-8 py-3 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500 shadow-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories
                      .filter((c) => c !== "all")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className={`${categories.length > 2 ? "md:col-span-3" : "md:col-span-6"}`}>
              <div className="relative">
                <ArrowUpDown
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-hemp-600"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-full border border-hemp-300 bg-hemp-200 pl-10 pr-8 py-3 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500 shadow-sm cursor-pointer"
                >
                  <option value="name-asc">Sort by: Name (A–Z)</option>
                  <option value="price-low">Sort by: Price (Low → High)</option>
                  <option value="price-high">Sort by: Price (High → Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-hemp-200 border border-hemp-200 p-12 text-center my-8 shadow-sm">
              <Sparkles size={36} className="mx-auto text-rust-500 mb-3" />
              <h3 className="font-serif text-xl font-bold text-hemp-900">No Products Found</h3>
              <p className="mt-2 text-sm text-hemp-700 max-w-md mx-auto">
                {searchQuery
                  ? `No products matched your search "${searchQuery}". Try a different search term.`
                  : "No products are currently available in the catalog."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-hemp-900 px-6 py-2.5 text-xs font-semibold text-cream hover:bg-rust-600 transition"
                >
                  Reset Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const mainImage = product.images?.[0] || null;
                const linkHref = `/product/${product.slug || product.id}`;

                return (
                  <Link
                    key={product.id || product.slug}
                    href={linkHref}
                    className="group rounded-2xl bg-hemp-200 border border-hemp-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square w-full bg-hemp-200 p-6 flex items-center justify-center overflow-hidden">
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 3}
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
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

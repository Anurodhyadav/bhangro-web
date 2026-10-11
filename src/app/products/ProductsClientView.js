"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Sparkles, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCarousel from "@/components/CategoryCarousel";

export default function ProductsClientView({ initialProducts = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc | name-desc | price-low | price-high
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Derive all unique categories dynamically and sort alphabetically
  const availableCategories = useMemo(() => {
    const set = new Set();
    initialProducts.forEach((p) => {
      if (p.category && typeof p.category === "string" && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialProducts]);

  // Compute visible groups: filter by category and search, group by category, sort each group
  const categoryGroups = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    // Determine target categories based on selected filter
    const categoriesToProcess =
      selectedCategory === "all"
        ? availableCategories
        : availableCategories.filter(
            (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
          );

    const groups = [];

    for (const cat of categoriesToProcess) {
      // 1. Filter by category
      let matchingProducts = initialProducts.filter(
        (p) => (p.category || "").trim().toLowerCase() === cat.toLowerCase()
      );

      // 2. Search by product name (case-insensitive, trimmed) live
      if (trimmedQuery) {
        matchingProducts = matchingProducts.filter((p) =>
          (p.name || "").toLowerCase().includes(trimmedQuery)
        );
      }

      // 3. Only keep groups with matching products (hide empty carousels)
      if (matchingProducts.length > 0) {
        // 4. Sort within this carousel group
        const sortedProducts = [...matchingProducts].sort((a, b) => {
          if (sortBy === "name-asc") {
            return (a.name || "").localeCompare(b.name || "", undefined, {
              sensitivity: "base",
            });
          } else if (sortBy === "name-desc") {
            return (b.name || "").localeCompare(a.name || "", undefined, {
              sensitivity: "base",
            });
          } else if (sortBy === "price-low") {
            return (a.price || 0) - (b.price || 0);
          } else if (sortBy === "price-high") {
            return (b.price || 0) - (a.price || 0);
          }
          return 0;
        });

        groups.push({
          category: cat,
          products: sortedProducts,
        });
      }
    }

    return groups;
  }, [initialProducts, availableCategories, searchQuery, selectedCategory, sortBy]);

  // Calculate total visible products currently displayed
  const visibleCount = useMemo(() => {
    return categoryGroups.reduce((acc, group) => acc + group.products.length, 0);
  }, [categoryGroups]);

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

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
              Showing {visibleCount} of {initialProducts.length} items
            </div>
          </div>

          {/* Controls Bar: Search, Category Filter & Sort */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
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
                className="w-full rounded-full border border-hemp-300 bg-hemp-200 pl-11 pr-14 py-3 text-sm text-hemp-900 placeholder-hemp-600 focus:outline-none focus:ring-2 focus:ring-rust-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-hemp-600 hover:text-hemp-900 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3">
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-hemp-600 pointer-events-none"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-full border border-hemp-300 bg-hemp-200 pl-10 pr-8 py-3 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500 shadow-sm cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <div className="relative">
                <ArrowUpDown
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-hemp-600 pointer-events-none"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-full border border-hemp-300 bg-hemp-200 pl-10 pr-8 py-3 text-sm font-medium text-hemp-900 focus:outline-none focus:ring-2 focus:ring-rust-500 shadow-sm cursor-pointer"
                >
                  <option value="name-asc">Sort by: Name (A–Z)</option>
                  <option value="name-desc">Sort by: Name (Z–A)</option>
                  <option value="price-low">Sort by: Price (Low → High)</option>
                  <option value="price-high">Sort by: Price (High → Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Carousels or Empty State */}
          {categoryGroups.length === 0 ? (
            <div className="rounded-3xl bg-hemp-200 border border-hemp-200 p-12 text-center my-8 shadow-sm">
              <Sparkles size={36} className="mx-auto text-rust-500 mb-3" />
              <h3 className="font-serif text-xl font-bold text-hemp-900">
                No Products Found
              </h3>
              <p className="mt-2 text-sm text-hemp-700 max-w-md mx-auto">
                {searchQuery || selectedCategory !== "all"
                  ? "No products match your search or filter criteria. Try adjusting your search term or clearing filters."
                  : "No products are currently available in the catalog."}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-hemp-900 px-6 py-2.5 text-xs font-semibold text-cream hover:bg-rust-600 transition cursor-pointer"
                >
                  Clear Search & Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-16">
              {categoryGroups.map((group) => (
                <CategoryCarousel
                  key={group.category}
                  category={group.category}
                  products={group.products}
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  sortBy={sortBy}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

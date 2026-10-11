"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

/**
 * Reusable CategoryCarousel component
 * Displays a single category's products in a responsive scroll-snap carousel
 * (2 cards per view on desktop lg+, 1 card per view on mobile <lg).
 */
export default function CategoryCarousel({
  category,
  products = [],
  searchQuery = "",
  selectedCategory = "all",
  sortBy = "name-asc",
}) {
  const containerRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Compute whether carousel can scroll prev/next and whether it overflows
  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const tolerance = 4; // Tolerance for subpixel browser rounding

    const overflow = scrollWidth > clientWidth + tolerance;
    setHasOverflow(overflow);
    setCanScrollPrev(scrollLeft > tolerance);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - tolerance);
  }, []);

  // Reset scroll position to the start whenever search, filter, or sort changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
    updateScrollState();
  }, [searchQuery, selectedCategory, sortBy, products, updateScrollState]);

  // Set up listeners for scroll, window resize, and container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Run check after layout
    updateScrollState();
    const frameId = requestAnimationFrame(updateScrollState);

    const handleScroll = () => {
      updateScrollState();
    };

    const handleResize = () => {
      updateScrollState();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateScrollState, products]);

  const handleScroll = (direction) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollDistance = container.clientWidth;

    container.scrollBy({
      left: direction === "next" ? scrollDistance : -scrollDistance,
      behavior: "smooth",
    });

    // Re-check after smooth scroll settles
    setTimeout(() => {
      updateScrollState();
    }, 350);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleScroll("prev");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleScroll("next");
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  const categorySlug = (category || "category")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  return (
    <section
      className="w-full min-w-0"
      aria-labelledby={`category-heading-${categorySlug}`}
    >
      {/* Category Heading & Navigation Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2
            id={`category-heading-${categorySlug}`}
            className="font-serif text-2xl sm:text-3xl font-bold text-hemp-900"
          >
            {category}
          </h2>
          <span className="text-xs font-semibold text-hemp-700 bg-hemp-200 border border-hemp-200 px-3 py-1 rounded-full shadow-sm">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Hide arrows if category has no more items than fit in one view */}
        {hasOverflow && (
          <div
            className="flex items-center gap-2"
            aria-label={`${category} carousel navigation`}
          >
            <button
              type="button"
              onClick={() => handleScroll("prev")}
              disabled={!canScrollPrev}
              aria-disabled={!canScrollPrev}
              aria-label={`Previous ${category} products`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hemp-300 bg-hemp-200 text-hemp-900 shadow-sm transition hover:bg-rust-500 hover:text-cream hover:border-rust-500 focus:outline-none focus:ring-2 focus:ring-rust-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-hemp-200 disabled:hover:text-hemp-900 disabled:hover:border-hemp-300 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("next")}
              disabled={!canScrollNext}
              aria-disabled={!canScrollNext}
              aria-label={`Next ${category} products`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hemp-300 bg-hemp-200 text-hemp-900 shadow-sm transition hover:bg-rust-500 hover:text-cream hover:border-rust-500 focus:outline-none focus:ring-2 focus:ring-rust-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-hemp-200 disabled:hover:text-hemp-900 disabled:hover:border-hemp-300 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Track:
          - Small screens (< lg): 1 item per view (w-full min-w-full)
          - Large screens (>= lg): 2 items per view (calc(50% - 0.75rem) with gap-6)
      */}
      <div
        ref={containerRef}
        role="region"
        aria-label={`${category} products carousel`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2 -my-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-rust-500 rounded-2xl w-full min-w-0"
      >
        {products.map((product, index) => (
          <div
            key={product.id || product.slug || `${category}-${index}`}
            data-carousel-item
            className="w-full min-w-full max-w-full lg:w-[calc(50%-0.75rem)] lg:min-w-[calc(50%-0.75rem)] lg:max-w-[calc(50%-0.75rem)] shrink-0 snap-start flex flex-col"
          >
            <ProductCard product={product} priority={index < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

// TODO: replace with real products pulled from Firestore once the admin panel is wired up
const products = [
  { name: "Hemp Backpack", price: "NPR 2,800", tag: "Bestseller" },
  { name: "Dhaka Tote Bag", price: "NPR 1,900", tag: "New" },
  { name: "Leather-Trim Fanny Pack", price: "NPR 1,400", tag: null },
  { name: "Hemp Side Bag", price: "NPR 1,600", tag: null },
];

export default function FeaturedProducts() {
  return (
    <section id="products" className="bg-hemp-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-medium text-rust-600">The Collection</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-hemp-900">
              Backpacks, totes & more
            </h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 font-medium text-hemp-800 hover:text-rust-600">
            View all products <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.name} className="group rounded-2xl border border-hemp-200 bg-cream overflow-hidden hover:shadow-xl transition">
              <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-hemp-200 via-hemp-100 to-rust-400/40">
                <ShoppingBag size={48} className="text-hemp-700/60" />
                {product.tag && (
                  <span className="absolute top-3 left-3 rounded-full bg-rust-500 px-3 py-1 text-xs font-medium text-cream">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-hemp-900">{product.name}</h3>
                <p className="mt-1 text-hemp-700">{product.price}</p>
                <button className="mt-4 w-full rounded-full border border-hemp-800 py-2 text-sm font-medium text-hemp-800 group-hover:bg-hemp-800 group-hover:text-cream transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
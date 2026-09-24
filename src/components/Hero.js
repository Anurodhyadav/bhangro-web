import {  ArrowRight, Leaf } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "./icons/BrandIcons";
import Link from "next/link";
import HempBagIllustration from "./Hempillustration";
import HempPatternBackground from "./HempPatternBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hemp-900 text-cream">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-rust-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-hemp-400/20 blur-3xl" />

      <HempPatternBackground />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28 items-center z-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-hemp-200/10 px-4 py-1.5 text-sm font-medium text-hemp-100">
            <Leaf size={16} className="text-rust-400" />
            Authentic Hemp · Handmade in Nepal
          </span>

          <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl font-semibold">
            Bags with a little
            <span className="text-rust-400"> piece of Nepal</span> in every stitch
          </h1>

          <p className="mt-6 max-w-md text-lg text-hemp-100/90">
            Backpacks, fanny packs and side bags — handcrafted from 100% hemp,
            Nepali Dhaka fabric by artisans in Kathmandu.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-rust-500 px-6 py-3 font-medium text-cream hover:bg-rust-600 transition-colors"
            >
              Shop the Collection
              <ArrowRight size={18} />
            </Link>
            <Link
              href="https://www.instagram.com/bhangro__/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 font-medium hover:border-cream transition-colors"
            >
              <InstagramIcon size={18} />
              @bhangro__
            </Link>
          </div>
        </div>

        {/* Photo placeholder — swap for a real product/lifestyle photo */}
        {/* <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rounded-[2.5rem] bg-gradient-to-br from-hemp-700 via-hemp-600 to-rust-500 shadow-2xl">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-cream/80">
            <Leaf size={56} strokeWidth={1.2} />
            <p className="text-sm font-medium">Add a lifestyle photo of your bags here</p>
          </div>
        </div> */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rounded-[2.5rem] bg-gradient-to-br from-hemp-700 via-hemp-600 to-rust-500 shadow-2xl overflow-hidden">
  <HempBagIllustration className="absolute inset-0 p-10" />
</div>
      </div>
    </section>
  );
}
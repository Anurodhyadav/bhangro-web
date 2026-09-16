import { Leaf } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div className="relative order-2 md:order-1 aspect-4/3 rounded-3xl bg-gradient-to-br from-hemp-700 to-hemp-900 flex items-center justify-center text-cream/80">
          <div className="text-center px-6">
            <Leaf size={48} className="mx-auto" strokeWidth={1.2} />
            <p className="mt-3 text-sm font-medium">Add a photo of your workshop or artisans here</p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="font-medium text-rust-600">Our Story</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-hemp-900">
            Rooted in Nepal, made to be carried
          </h2>
          <p className="mt-5 text-hemp-700 leading-relaxed">
            Bhangro began with a simple idea: everyday bags shouldn&apos;t cost the earth to make.
            We work with local artisans in Kathmandu who weave hemp fiber and Nepali Dhaka fabric
            by hand, finishing each piece with genuine leather so it only gets better with age.
          </p>
          <p className="mt-4 text-hemp-700 leading-relaxed">
            Every backpack, tote, fanny pack and side bag is made in small batches — durable,
            biodegradable, and carrying a little piece of Nepal wherever it goes.
          </p>
        </div>
      </div>
    </section>
  );
}
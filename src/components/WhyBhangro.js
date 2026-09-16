import { Leaf, Layers, Gem, MapPin } from "lucide-react";

const features = [
  { icon: Leaf, title: "100% Hemp", description: "Durable, breathable and biodegradable fiber grown in the Himalayan foothills." },
  { icon: Layers, title: "Nepali Dhaka", description: "Handwoven Dhaka fabric accents bring traditional Nepali pattern to every piece." },
  { icon: Gem, title: "Pure Leather", description: "Genuine leather trims and straps add strength and character that lasts." },
  { icon: MapPin, title: "Handmade in Kathmandu", description: "Every bag is cut, woven and stitched by local artisans in small batches." },
];

export default function WhyBhangro() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <p className="font-medium text-rust-600">Why Bhangro</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-hemp-900">
          Crafted with purpose, made to last
        </h2>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-hemp-200 bg-hemp-50 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-hemp-800 text-cream">
              <Icon size={26} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-hemp-900">{title}</h3>
            <p className="mt-2 text-sm text-hemp-700">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
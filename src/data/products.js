import bag1 from "@/assets/bag1.png";
import bag6 from "@/assets/bag6.png";
import dualBag from "@/assets/dual-bag.png";
import dualBag2 from "@/assets/dual-bag-2.png";
import bag2GirlModel from "@/assets/bag-2-girl-model.png";
import bag3MaleModel from "@/assets/bag-3-male-model.png";
import bag4GirlModel from "@/assets/bag-4-girl-model.png";
import bag5GirlModel from "@/assets/bag-5-girl-model.png";

export const products = [
  {
    id: "boulder-sack",
    slug: "boulder-sack",
    name: "Boulder Sack",
    price: 2750,
    formattedPrice: "Rs. 2,750.00",
    category: "Backpacks",
    color: "Moss Green / Beige",
    fabric: "100% Wild Hemp & Heavy Cotton Canvas",
    dimensions: '17.25"(H) x 12"(W) x 6"(D)',
    volume: "21 L",
    description:
      "Stylish and spacious, the Boulder Sack is a casual, everyday backpack handcrafted in Kathmandu for those who like to wander. Built with heavy-duty wild hemp and padded shoulder straps for maximum durability and comfort.",
    features: [
      'Padded laptop compartment which fits up to 15" laptops',
      "Bartack stitches on joints for exceptional strength",
      "Consists of a drawstring closure",
      "Spacious and stylish main compartment",
      "Internal pocket compartments for better organization",
      "Air mesh shoulder padding",
      "On-strap signature Bhangro acrylic emblem",
    ],
    images: [bag1, dualBag, bag6, dualBag2],
    lifestyleImage: bag5GirlModel,
  },
  {
    id: "fleek-hip-pack",
    slug: "fleek-hip-pack",
    name: "Fleek Hip Pack",
    price: 1650,
    formattedPrice: "Rs. 1,650.00",
    category: "Hip Packs",
    color: "Navy & Slate Grey",
    fabric: "Handwoven Nepali Hemp & Recycled Poly",
    dimensions: '6"(H) x 11"(W) x 3.5"(D)',
    volume: "3.5 L",
    description:
      "Compact, vibrant, and ultra-versatile. Wear it around your waist or cross-body over the shoulder. Designed for quick access to your everyday essentials while on the move.",
    features: [
      "Dual zip compartments with weather-resistant zippers",
      "Adjustable woven belt with quick-release buckle",
      "Key tether and hidden passport pocket on the back",
      "Durable water-repellent lining fabric",
      "Handmade with eco-friendly natural hemp yarn",
    ],
    images: [dualBag, bag1, dualBag2],
    lifestyleImage: bag4GirlModel,
  },
  {
    id: "hemp-rolltop-backpack",
    slug: "hemp-rolltop-backpack",
    name: "Rolltop Hemp Explorer",
    price: 3200,
    formattedPrice: "Rs. 3,200.00",
    category: "Backpacks",
    color: "Natural Raw Hemp / Forest Green",
    fabric: "Pure Himalayan Hemp & Traditional Dhaka",
    dimensions: '18"-24"(H) x 11.5"(W) x 5.5"(D)',
    volume: "24 L (Expandable)",
    description:
      "An expandable rolltop design inspired by mountain expeditions. Crafted from thick hand-spun Himalayan hemp and detailed with authentic woven Nepali Dhaka trim.",
    features: [
      "Expandable rolltop enclosure with heavy-duty side buckles",
      'Dedicated suspended 15.6" laptop sleeve',
      "Front diagonal zipper pocket for quick access",
      "Water bottle holder pockets on both sides",
      "Ergonomic padded backpanel with airflow channels",
    ],
    images: [bag6, bag1, dualBag2],
    lifestyleImage: bag3MaleModel,
  },
  {
    id: "urban-side-bag",
    slug: "urban-side-bag",
    name: "Urban Hemp Side Bag",
    price: 1850,
    formattedPrice: "Rs. 1,850.00",
    category: "Side Bags",
    color: "Burgundy & Charcoal",
    fabric: "Natural Hemp Fabric & Pure Leather Accents",
    dimensions: '10"(H) x 8.5"(W) x 3"(D)',
    volume: "5 L",
    description:
      "The perfect minimalist companion for city explorations and light travel. Holds a tablet, notebook, wallet, and camera with ease.",
    features: [
      'Padded sleeve fitting tablets up to 10.5"',
      "Adjustable canvas shoulder strap with metal hardware",
      "Front flap with secure magnetic button closure",
      "Rear anti-theft zipper pocket",
    ],
    images: [dualBag2, bag6, bag1],
    lifestyleImage: bag2GirlModel,
  },
];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function getRelatedProducts(currentSlug) {
  return products.filter((p) => p.slug !== currentSlug);
}

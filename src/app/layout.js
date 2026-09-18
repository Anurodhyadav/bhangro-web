import { Fraunces, Figtree } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://bhangro.com"), // TODO: replace with your real domain
  title: {
    default: "Bhangro | Authentic Hemp Bags, Handmade in Nepal",
    template: "%s | Bhangro",
  },
  description:
    "Bhangro crafts backpacks, tote bags, fanny packs and side bags from 100% hemp, Nepali Dhaka and pure leather — handmade in Kathmandu, Nepal.",
  keywords: [
    "hemp bags Nepal",
    "Bhangro",
    "handmade backpack Nepal",
    "Dhaka bag",
    "Nepali hemp backpack",
    "sustainable bags Nepal",
  ],
  openGraph: {
    title: "Bhangro | Authentic Hemp Bags, Handmade in Nepal",
    description:
      "Backpacks, totes, fanny packs & side bags made from 100% hemp, Nepali Dhaka & pure leather.",
    url: "https://bhangro.com",
    siteName: "Bhangro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhangro | Authentic Hemp Bags, Handmade in Nepal",
    description:
      "Backpacks, totes, fanny packs & side bags made from 100% hemp, Nepali Dhaka & pure leather.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      <body className="bg-cream text-charcoal font-sans antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
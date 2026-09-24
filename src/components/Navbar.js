"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.jpg";

const links = [
  { href: "/#products", label: "Shop Collection" },
  { href: "/#about", label: "Our Story" },
  { href: "/#connect", label: "Visit & Follow" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-hemp-400 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Bhangro Logo"
            height={64}
            className="h-16 w-auto object-contain rounded-md"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-medium text-hemp-900">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-hemp-200 transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full bg-hemp-800 px-4 py-2 text-sm font-medium text-cream hover:bg-rust-600 transition-colors"
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rust-500 text-xs font-bold text-cream">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-hemp-800"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-hemp-200 bg-cream px-6 py-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block font-medium text-hemp-700"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-4 pt-2">
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 font-medium text-rust-600"
            >
              <ShoppingBag size={18} />
              <span>Cart ({cartCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";

const links = [
  { href: "#products", label: "Shop" },
  { href: "#about", label: "Our Story" },
  { href: "#connect", label: "Visit & Follow" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-hemp-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-wide text-hemp-800">
          Bhangro <span aria-hidden>🌿</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-medium text-hemp-700">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-rust-500 transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-hemp-700 hover:text-rust-500 transition-colors"
          >
            <User size={18} />
            <span className="text-sm font-medium">Login</span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full bg-hemp-800 px-4 py-2 text-sm font-medium text-cream hover:bg-rust-600 transition-colors"
          >
            <ShoppingBag size={18} />
            Cart
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-hemp-800" aria-label="Toggle menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-hemp-200 bg-cream px-6 py-4 space-y-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block font-medium text-hemp-700">
              {link.label}
            </a>
          ))}
          <div className="flex gap-4 pt-2">
            <Link href="/login" className="text-hemp-700 font-medium">Login</Link>
            <Link href="/cart" className="text-rust-600 font-medium">Cart</Link>
          </div>
        </div>
      )}
    </header>
  );
}
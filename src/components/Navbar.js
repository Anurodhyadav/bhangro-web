"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, User, LogOut, ShieldCheck, ChevronDown, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.jpg";

const links = [
  { href: "/products", label: "Shop Collection" },
  { href: "/#about", label: "Our Story" },
  { href: "/#connect", label: "Visit & Follow" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin, loading, loginWithGoogle, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-1 text-rust-600 font-bold hover:text-rust-700 transition-colors"
              >
                <ShieldCheck size={16} /> Admin Panel
              </Link>
            </li>
          )}
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

          {/* Auth Section */}
          {loading ? (
            <div className="flex items-center justify-center w-9 h-9">
              <Loader2 className="animate-spin text-hemp-800" size={18} />
            </div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center cursor-pointer gap-2 rounded-full border border-hemp-300 bg-hemp-200 px-3 py-1.5 text-sm font-medium text-hemp-900 hover:bg-hemp-200 transition"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={26}
                    height={26}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-hemp-800 text-xs text-cream">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[100px] truncate">{user.displayName || "Account"}</span>
                <ChevronDown size={14} className="text-hemp-700" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-hemp-200 border border-hemp-200 shadow-xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-hemp-200">
                    <p className="font-bold text-hemp-900 truncate">{user.displayName || "User"}</p>
                    <p className="text-xs text-hemp-700 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-rust-100 text-rust-700 text-[10px] font-bold rounded-md">
                        Admin User
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-hemp-900 hover:bg-hemp-100 font-medium transition"
                    >
                      <ShieldCheck size={16} className="text-rust-600" /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium transition text-left"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 rounded-full border border-hemp-800 px-4 py-2 text-sm font-medium text-hemp-900 hover:bg-hemp-800 hover:text-cream transition-colors"
            >
              <User size={18} />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-hemp-800"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-hemp-200 bg-hemp-200 px-6 py-4 space-y-4">
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

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 font-bold text-rust-600"
            >
              <ShieldCheck size={18} /> Admin Panel
            </Link>
          )}

          <div className="flex flex-col gap-3 pt-3 border-t border-hemp-200">
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 font-medium text-rust-600"
            >
              <ShoppingBag size={18} />
              <span>Cart ({cartCount})</span>
            </Link>

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-hemp-800" />
                  <span className="font-medium text-hemp-900 text-sm truncate max-w-[160px]">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-red-600"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  loginWithGoogle();
                }}
                className="flex items-center gap-2 font-medium text-hemp-900 pt-1"
              >
                <User size={18} /> Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
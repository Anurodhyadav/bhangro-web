import React from "react";

/**
 * Illustrated hemp tote bag with hemp leaves tucked against the handle.
 * Uses Tailwind color variable classes (fill-rust-500, fill-cream, etc.)
 * matching the "Shop the Collection" button color system.
 */
export default function HempBagIllustration({ className = "" }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 400 500"
        className="illustration-wrap h-full w-full"
        role="img"
        aria-label="Illustrated hemp tote bag with hemp leaves"
      >
        <g className="bag-float">
          {/* Leaves, tucked close against the left handle */}
          <g transform="translate(118,150) rotate(-18)">
            <path
              className="leaf-sway fill-hemp-300"
              style={{ animationDelay: "0s" }}
              d="M0,-52 C17,-33 17,19 0,52 C-17,19 -17,-33 0,-52 Z"
            />
          </g>
          <g transform="translate(150,112) rotate(22) scale(1.1)">
            <path
              className="leaf-sway fill-hemp-400"
              style={{ animationDelay: "0.6s" }}
              d="M0,-52 C17,-33 17,19 0,52 C-17,19 -17,-33 0,-52 Z"
            />
          </g>
          <g transform="translate(146,178) rotate(-62) scale(0.65)">
            <path
              className="leaf-sway fill-hemp-900"
              style={{ animationDelay: "1.1s" }}
              opacity="0.6"
              d="M0,-52 C17,-33 17,19 0,52 C-17,19 -17,-33 0,-52 Z"
            />
          </g>

          {/* Short stem linking the leaves to the handle */}
          <path
            d="M128,182 C133,196 143,201 154,194"
            className="stroke-hemp-300"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />

          {/* Handles */}
          <path
            d="M140,190 C140,150 160,150 160,190"
            className="stroke-rust-600"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M240,190 C240,150 260,150 260,190"
            className="stroke-rust-600"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Bag body - Uses fill-rust-500 (tied to theme variable --color-rust-500) */}
          <rect x="90" y="190" width="220" height="230" rx="26" className="fill-rust-500" />

          {/* Woven texture lines */}
          <line x1="105" y1="222" x2="295" y2="222" className="stroke-cream" strokeWidth="3" opacity="0.2" />
          <line x1="105" y1="252" x2="295" y2="252" className="stroke-cream" strokeWidth="3" opacity="0.2" />
          <line x1="105" y1="282" x2="295" y2="282" className="stroke-cream" strokeWidth="3" opacity="0.2" />
          <line x1="105" y1="312" x2="295" y2="312" className="stroke-cream" strokeWidth="3" opacity="0.2" />

          {/* Stitched pocket */}
          <rect
            x="160"
            y="330"
            width="80"
            height="55"
            rx="10"
            className="fill-rust-600 stroke-cream"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
}
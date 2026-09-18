import React from "react";

/**
 * Subtle decorative background pattern featuring delicate line-art hemp leaves 
 * woven with organic contour/web lines.
 * Positioned on the left side of the Hero section, fading out seamlessly to the right.
 */
export default function HempPatternBackground({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 w-full md:w-[62%] lg:w-[55%] overflow-hidden select-none z-0 ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.8) 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.8) 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <svg
        className="h-full w-full opacity-[0.14]"
        viewBox="0 0 700 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMid slice"
      >
        <defs>
          {/* Reusable palmate 7-blade hemp leaf line-art symbol */}
          <g id="hemp-leaf-symbol">
            {/* Center main blade */}
            <path
              d="M0 0 C-4 -30 -12 -80 0 -130 C12 -80 4 -30 0 0 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="currentColor"
              fillOpacity="0.05"
            />
            <path d="M0 0 L0 -125" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

            {/* Upper Right Blade */}
            <g transform="rotate(24)">
              <path
                d="M0 0 C-3 -25 -10 -68 0 -112 C10 -68 3 -25 0 0 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="currentColor"
                fillOpacity="0.04"
              />
              <path d="M0 0 L0 -107" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            </g>

            {/* Upper Left Blade */}
            <g transform="rotate(-24)">
              <path
                d="M0 0 C-3 -25 -10 -68 0 -112 C10 -68 3 -25 0 0 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="currentColor"
                fillOpacity="0.04"
              />
              <path d="M0 0 L0 -107" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            </g>

            {/* Mid Right Blade */}
            <g transform="rotate(52)">
              <path
                d="M0 0 C-3 -20 -8 -55 0 -90 C8 -55 3 -20 0 0 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="currentColor"
                fillOpacity="0.03"
              />
              <path d="M0 0 L0 -85" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            </g>

            {/* Mid Left Blade */}
            <g transform="rotate(-52)">
              <path
                d="M0 0 C-3 -20 -8 -55 0 -90 C8 -55 3 -20 0 0 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="currentColor"
                fillOpacity="0.03"
              />
              <path d="M0 0 L0 -85" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            </g>

            {/* Lower Right Blade */}
            <g transform="rotate(80)">
              <path
                d="M0 0 C-2 -15 -6 -40 0 -65 C6 -40 2 -15 0 0 Z"
                stroke="currentColor"
                strokeWidth="1"
                fill="currentColor"
                fillOpacity="0.02"
              />
            </g>

            {/* Lower Left Blade */}
            <g transform="rotate(-80)">
              <path
                d="M0 0 C-2 -15 -6 -40 0 -65 C6 -40 2 -15 0 0 Z"
                stroke="currentColor"
                strokeWidth="1"
                fill="currentColor"
                fillOpacity="0.02"
              />
            </g>

            {/* Petiole Stem */}
            <path d="M0 0 Q 2 25 5 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Secondary medium leaf */}
          <g id="hemp-leaf-small">
            <use href="#hemp-leaf-symbol" transform="scale(0.65)" />
          </g>
        </defs>

        {/* ---------------- ORGANIC CONTOUR WEB / MESH LINES ---------------- */}
        <g stroke="#b3a877" strokeWidth="0.8" opacity="0.85">
          {/* Sweeping concentric curved mesh lines originating from left edge */}
          <path d="M -50, 100 C 180, 80 350, 220 480, 420 C 580, 570 650, 750 720, 850" strokeDasharray="4 2" />
          <path d="M -50, 200 C 150, 170 320, 310 430, 500 C 520, 650 580, 790 620, 850" />
          <path d="M -50, 300 C 120, 270 270, 390 370, 570 C 450, 710 490, 810 520, 850" strokeDasharray="6 3" />
          <path d="M -50, 420 C 90, 380 220, 480 300, 640 C 360, 750 390, 820 410, 850" />
          <path d="M -50, 550 C 60, 500 160, 580 230, 710 C 270, 780 290, 820 300, 850" strokeDasharray="3 3" />

          {/* Transverse cross-contour web arcs connecting the leaves */}
          <path d="M 80, -20 C 140, 180 240, 320 390, 450 C 490, 540 600, 620 720, 680" strokeWidth="0.6" />
          <path d="M 220, -20 C 270, 150 360, 290 480, 400 C 580, 490 670, 550 750, 600" strokeWidth="0.6" strokeDasharray="5 3" />
          <path d="M 380, -20 C 420, 120 490, 230 590, 330 C 660, 400 730, 440 780, 470" strokeWidth="0.5" />
        </g>

        {/* Accent Rust/Warm Golden line mesh elements */}
        <g stroke="#c98552" strokeWidth="0.7" opacity="0.65">
          <path d="M -50, 50 C 220, 60 400, 180 540, 380 C 640, 520 720, 700 780, 850" />
          <path d="M 120, 800 C 200, 620 320, 460 480, 330 C 580, 240 680, 170 780, 120" strokeDasharray="4 4" />
        </g>

        {/* ---------------- HEMP LEAF NODES & WOVEN PLACEMENTS ---------------- */}

        {/* Leaf 1: Main prominent leaf flowing in top-left */}
        <g transform="translate(110, 180) rotate(-18)" fill="#b3a877" stroke="#b3a877">
          <use href="#hemp-leaf-symbol" transform="scale(1.35)" />
        </g>

        {/* Leaf 2: Medium upper leaf angled towards center */}
        <g transform="translate(280, 110) rotate(32)" fill="#8f8354" stroke="#8f8354">
          <use href="#hemp-leaf-symbol" transform="scale(0.95)" />
        </g>

        {/* Leaf 3: Central leaf emerging near middle left */}
        <g transform="translate(90, 440) rotate(-42)" fill="#c98552" stroke="#c98552">
          <use href="#hemp-leaf-symbol" transform="scale(1.2)" />
        </g>

        {/* Leaf 4: Interwoven leaf near center-bottom */}
        <g transform="translate(290, 380) rotate(14)" fill="#b3a877" stroke="#b3a877">
          <use href="#hemp-leaf-symbol" transform="scale(1.05)" />
        </g>

        {/* Leaf 5: Delicate smaller leaf tucked towards the top edge */}
        <g transform="translate(450, 210) rotate(58)" fill="#eae6d6" stroke="#eae6d6">
          <use href="#hemp-leaf-symbol" transform="scale(0.75)" opacity="0.8" />
        </g>

        {/* Leaf 6: Lower left leaf sweeping inward */}
        <g transform="translate(180, 620) rotate(-15)" fill="#8f8354" stroke="#8f8354">
          <use href="#hemp-leaf-symbol" transform="scale(1.1)" />
        </g>

        {/* Leaf 7: Outer right edge leaf fading into background */}
        <g transform="translate(440, 520) rotate(28)" fill="#b3a877" stroke="#b3a877">
          <use href="#hemp-leaf-symbol" transform="scale(0.85)" opacity="0.75" />
        </g>

        {/* Delicate Connecting Stems / Tendrils */}
        <g stroke="#b3a877" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round">
          <path d="M 110,180 Q 180,240 290,380" />
          <path d="M 90,440 Q 170,390 280,110" />
          <path d="M 180,620 Q 280,560 440,520" strokeDasharray="3 3" />
        </g>

        {/* Subtle Decorative Geo Dots on Web Intersections */}
        <g fill="#c98552" opacity="0.6">
          <circle cx="290" cy="380" r="3" />
          <circle cx="280" cy="110" r="2.5" />
          <circle cx="440" cy="520" r="2" />
          <circle cx="450" cy="210" r="2.5" />
          <circle cx="180" cy="620" r="3" />
        </g>
      </svg>
    </div>
  );
}

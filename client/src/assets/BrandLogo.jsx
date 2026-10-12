import React from "react";

export function BrandLogo({ size = 38, showWordmark = true, className = "" }) {
  return (
    <a
      href="/"
      className={`brand-link ${className}`.trim()}
      aria-label="Anchor Solutions home"
    >
      <svg
        className="brand-logo-icon"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M50 7 78 43H22L50 7Z" fill="#D4AF37" />
        <path d="M50 29 84 63 74 70 50 46 26 70 16 63 50 29Z" fill="#303030" />
        <path d="M50 57 76 76 50 95 24 76 50 57Z" fill="#E6BE45" />
      </svg>

      {showWordmark && (
        <span className="brand-text">
          <span className="brand-name">ANCHOR SOLUTIONS</span>
          <span className="brand-tagline-small">
            Educational Platform · Bahir Dar
          </span>
        </span>
      )}
    </a>
  );
}

export default BrandLogo;

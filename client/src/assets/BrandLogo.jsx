import React from 'react';

export function BrandLogo({ size = 38, showWordmark = true, className = '' }) {
  return (
    <div className={`brand-link ${className}`} style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0, textDecoration: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="brand-logo-icon"
        style={{ flexShrink: 0 }}
      >
        {/* Top Gold Triangle */}
        <path d="M50 8 L76 42 L24 42 Z" fill="#D4AF37" />
        {/* Upper Charcoal Chevron Layer */}
        <path d="M50 28 L84 62 L74 68 L50 44 L26 68 L16 62 Z" fill="#2B2B2B" />
        {/* Bottom Gold Diamond / Chevron base */}
        <path d="M50 56 L74 74 L50 92 L26 74 Z" fill="#E6BE45" />
      </svg>
      {showWordmark && (
        <div className="brand-text" style={{ minWidth: 0 }}>
          <span className="brand-name">
            ANCHOR SOLUTIONS
          </span>
          <span className="brand-tagline-small">
            Educational Platform · Bahir Dar
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;

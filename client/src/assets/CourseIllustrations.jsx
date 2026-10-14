import React from 'react';

export function CourseArtwork({ slug, className = '' }) {
  const getVisual = () => {
    switch (slug) {
      case 'graphics-design':
        return (
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="400" height="240" fill="#1C1826" />
            <circle cx="200" cy="120" r="85" fill="#D4AF37" fillOpacity="0.12" />
            {/* Color Swatches */}
            <rect x="70" y="50" width="45" height="45" rx="8" fill="#31A8FF" />
            <text x="82" y="78" fill="#fff" fontSize="16" fontWeight="bold">Ps</text>
            <rect x="125" y="50" width="45" height="45" rx="8" fill="#FF9A00" />
            <text x="139" y="78" fill="#fff" fontSize="16" fontWeight="bold">Ai</text>
            <rect x="180" y="50" width="45" height="45" rx="8" fill="#FF3366" />
            <text x="194" y="78" fill="#fff" fontSize="16" fontWeight="bold">Id</text>
            {/* Vector Pen Tool & Path */}
            <path d="M120 170 Q 200 90 280 160" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="120" cy="170" r="5" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="200" cy="125" r="5" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="280" cy="160" r="5" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" />
            {/* Pen Icon */}
            <path d="M240 100 L270 70 L285 85 L255 115 Z" fill="#D4AF37" />
            <polygon points="235,105 240,100 245,108" fill="#FFF" />
          </svg>
        );

      case 'video-editing':
        return (
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="400" height="240" fill="#151722" />
            <circle cx="200" cy="120" r="80" fill="#9933FF" fillOpacity="0.1" />
            {/* Software badges */}
            <rect x="70" y="45" width="45" height="45" rx="8" fill="#9933FF" />
            <text x="83" y="73" fill="#fff" fontSize="16" fontWeight="bold">Pr</text>
            <rect x="125" y="45" width="45" height="45" rx="8" fill="#330066" />
            <text x="138" y="73" fill="#fff" fontSize="16" fontWeight="bold">Ae</text>
            {/* Timeline track */}
            <rect x="60" y="125" width="280" height="20" rx="4" fill="#24283B" />
            <rect x="65" y="128" width="60" height="14" rx="3" fill="#00C49F" />
            <rect x="130" y="128" width="85" height="14" rx="3" fill="#D4AF37" />
            <rect x="220" y="128" width="95" height="14" rx="3" fill="#FF5370" />
            {/* Playhead */}
            <line x1="172" y1="105" x2="172" y2="165" stroke="#FFFFFF" strokeWidth="2" />
            <polygon points="167,105 177,105 172,115" fill="#FFFFFF" />
            {/* Audio Wave */}
            <path d="M60 175 Q 80 160 100 175 T 140 175 T 180 175 T 220 175 T 260 175 T 300 175 T 340 175" stroke="#41B883" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'photography':
        return (
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="400" height="240" fill="#1E1E1E" />
            <circle cx="200" cy="120" r="80" fill="#D4AF37" fillOpacity="0.08" />
            {/* Camera body outline */}
            <rect x="110" y="70" width="180" height="110" rx="14" fill="#2B2B2B" stroke="#444" strokeWidth="2" />
            <rect x="160" y="55" width="80" height="20" rx="6" fill="#383838" />
            {/* Red accent line (Canon L series style) */}
            <circle cx="200" cy="125" r="45" fill="#1A1A1A" stroke="#E53935" strokeWidth="3" />
            {/* Lens Aperture Elements */}
            <circle cx="200" cy="125" r="30" fill="#111" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="190" cy="115" r="8" fill="#FFF" fillOpacity="0.15" />
            {/* Flash button & viewfinder */}
            <rect x="255" y="60" width="20" height="8" rx="2" fill="#D4AF37" />
          </svg>
        );

      case 'digital-marketing':
        return (
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="400" height="240" fill="#16202C" />
            {/* Upward Growth Chart */}
            <path d="M70 180 L140 145 L200 160 L270 95 L330 65" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="330" cy="65" r="6" fill="#D4AF37" />
            {/* Megaphone / Bullhorn */}
            <path d="M100 110 L140 85 L140 135 Z" fill="#3B82F6" />
            <rect x="85" y="100" width="20" height="20" rx="4" fill="#2563EB" />
            <path d="M140 98 Q 165 98 165 110 Q 165 122 140 122" fill="#60A5FA" />
            {/* Telegram & Social badges */}
            <circle cx="290" cy="140" r="22" fill="#229ED9" />
            <path d="M280 140 L287 147 L302 133" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'mobile-computer-maintenance':
        return (
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="400" height="240" fill="#1A1D20" />
            {/* Laptop Base */}
            <rect x="180" y="85" width="140" height="90" rx="6" fill="#2A2F35" stroke="#48525E" strokeWidth="2" />
            <rect x="190" y="95" width="120" height="70" rx="4" fill="#0078D7" />
            <polygon points="160,185 340,185 320,175 180,175" fill="#3A414A" />
            {/* Smartphone Teardown */}
            <rect x="90" y="70" width="70" height="125" rx="10" fill="#111" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="125" cy="80" r="3" fill="#555" />
            <rect x="98" y="92" width="54" height="85" rx="3" fill="#222" />
            {/* Screwdriver and tool */}
            <line x1="80" y1="50" x2="115" y2="85" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'basic-computer-skills':
        return (
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="400" height="240" fill="#172230" />
            {/* Desktop Monitor */}
            <rect x="110" y="55" width="180" height="110" rx="8" fill="#202D3D" stroke="#405670" strokeWidth="2" />
            <rect x="120" y="65" width="160" height="90" rx="4" fill="#0E1724" />
            {/* Stand */}
            <rect x="188" y="165" width="24" height="20" fill="#2E3E52" />
            <rect x="160" y="185" width="80" height="8" rx="4" fill="#2E3E52" />
            {/* MS Office Icons */}
            <rect x="135" y="85" width="30" height="30" rx="4" fill="#185ABD" />
            <text x="144" y="106" fill="#fff" fontSize="16" fontWeight="bold">W</text>
            <rect x="185" y="85" width="30" height="30" rx="4" fill="#107C41" />
            <text x="195" y="106" fill="#fff" fontSize="16" fontWeight="bold">X</text>
            <rect x="235" y="85" width="30" height="30" rx="4" fill="#C43E1C" />
            <text x="245" y="106" fill="#fff" fontSize="16" fontWeight="bold">P</text>
          </svg>
        );

      case 'artificial-intelligence':
      default:
        return (
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="400" height="240" fill="#141824" />
            <circle cx="200" cy="120" r="75" fill="#D4AF37" fillOpacity="0.12" />
            {/* Neural Network Nodes */}
            <circle cx="130" cy="90" r="10" fill="#D4AF37" />
            <circle cx="130" cy="150" r="10" fill="#D4AF37" />
            <circle cx="200" cy="65" r="12" fill="#E6BE45" />
            <circle cx="200" cy="120" r="14" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="3" />
            <circle cx="200" cy="175" r="12" fill="#E6BE45" />
            <circle cx="270" cy="90" r="10" fill="#D4AF37" />
            <circle cx="270" cy="150" r="10" fill="#D4AF37" />
            {/* Connections */}
            <line x1="130" y1="90" x2="200" y2="65" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="130" y1="90" x2="200" y2="120" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="130" y1="150" x2="200" y2="120" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="130" y1="150" x2="200" y2="175" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="200" y1="65" x2="270" y2="90" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="200" y1="120" x2="270" y2="90" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="200" y1="120" x2="270" y2="150" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
            <line x1="200" y1="175" x2="270" y2="150" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.6" />
          </svg>
        );
    }
  };

  return (
    <div className={`course-artwork-container ${className}`} style={{ width: '100%', height: '100%', display: 'flex' }}>
      {getVisual()}
    </div>
  );
}

export default CourseArtwork;

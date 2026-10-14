import React, { useState } from 'react';
import { CourseArtwork } from '../assets/CourseIllustrations.jsx';

/**
 * Image component that loads the actual uploaded image asset from /images/courses/[slug].jpg
 * and gracefully falls back to the custom vector artwork if the physical file is still loading or absent.
 */
export function CourseImage({
  slug,
  title,
  src,
  alt,
  className = '',
  aspectRatio = '16 / 10',
  style = {},
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Map slug to local public image path
  const defaultImagePath = src || `/images/courses/${slug}.jpg`;
  const defaultAlt = alt || `${title || slug} training course poster at Anchor Solutions`;

  if (hasError) {
    return (
      <div
        className={`course-artwork-container ${className}`}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio,
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        <CourseArtwork slug={slug} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`course-image-wrapper ${className}`}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface)',
        ...style,
      }}
    >
      <img
        src={defaultImagePath}
        alt={defaultAlt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          opacity: isLoaded ? 1 : 0.85,
        }}
      />
    </div>
  );
}

export default CourseImage;

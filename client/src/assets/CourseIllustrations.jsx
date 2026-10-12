import React from "react";

const courseImages = {
  "graphics-design": "/images/courses/graphics design.jpg",
  photography: "/images/courses/photography.jpg",
  "basic-computer-skills": "/images/courses/Basic Computer skills.jpg",
  "mobile-computer-maintenance":
    "/images/courses/Mobile and computer maintenance.jpg",
};

export function CourseArtwork({ slug, className = "" }) {
  const image = courseImages[slug];

  if (!image) {
    console.warn(`No image configured for course: ${slug}`);
    return null;
  }

  return (
    <div className={`course-artwork-container ${className}`}>
      <img
        src={image}
        alt={`${slug.replaceAll("-", " ")} course`}
        loading="lazy"
        decoding="async"
        onError={(event) => {
          console.error("Course image failed to load:", image);
          event.currentTarget.style.visibility = "hidden";
        }}
      />
    </div>
  );
}

export default CourseArtwork;

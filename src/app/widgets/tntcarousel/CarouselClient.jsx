"use client";

import { useEffect, useMemo, useState } from "react";

export default function Carousel({ items = [] }) {
  const slides = useMemo(() => items.filter(Boolean), [items]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const calculateVisibleCount = () => {
      if (typeof window === "undefined") {
        return 1;
      }

      const width = window.innerWidth;
      if (width >= 1536) return 5;
      if (width >= 1024) return 3;
      return 1;
    };

    const updateVisibleCount = () => {
      const count = calculateVisibleCount();
      setVisibleCount((prev) => {
        if (prev === count) return prev;
        return count;
      });
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, slides.length - visibleCount);
      return Math.min(prev, maxIndex);
    });
  }, [slides.length, visibleCount]);

  const maxIndex = Math.max(0, slides.length - visibleCount);
  const canNavigate = slides.length > visibleCount;
  const clampIndex = (index, { wrap = false } = {}) => {
    if (maxIndex === 0) {
      return 0;
    }

    if (wrap) {
      if (index < 0) return maxIndex;
      if (index > maxIndex) return 0;
      return index;
    }

    if (index < 0) return 0;
    if (index > maxIndex) return maxIndex;
    return index;
  };

  useEffect(() => {
    if (!canNavigate || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (maxIndex === 0) return 0;
        const next = prev + 1;
        if (next > maxIndex) {
          return 0;
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [canNavigate, isHovered, maxIndex]);

  if (slides.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-100 p-4 text-center text-sm text-zinc-500">
        No items found. Check that your Google Sheet has data and is published.
      </div>
    );
  }

  const goTo = (nextIndex, options = {}) => {
    setCurrentIndex((prev) => {
      const target =
        typeof nextIndex === "number" ? nextIndex : prev;
      return clampIndex(target, options);
    });
  };

  const goPrevious = () => goTo(currentIndex - 1, { wrap: true });
  const goNext = () => goTo(currentIndex + 1, { wrap: true });

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
    setTouchEndX(null);
    setIsHovered(true);
  };

  const handleTouchMove = (event) => {
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const delta = touchStartX - touchEndX;
    const swipeThreshold = 40;

    if (delta > swipeThreshold) {
      goNext();
    } else if (delta < -swipeThreshold) {
      goPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setIsHovered(false);
  };

  return (
    <div
      className="flex w-full flex-col gap-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${
              (currentIndex * 100) / visibleCount
            }%)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <article
              key={`${slide.title ?? "slide"}-${index}`}
              className="w-full shrink-0 px-3 py-4"
              style={{
                flexBasis: `${100 / visibleCount}%`,
                maxWidth: `${100 / visibleCount}%`,
              }}
            >
              {slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title || "Carousel image"}
                  className="mb-4 aspect-video w-full rounded-xl object-cover"
                  loading={index === currentIndex ? "eager" : "lazy"}
                />
              ) : null}
              <div className="flex flex-col gap-2">
                {slide.title ? (
                  <h2 className="text-2xl font-semibold text-zinc-900">
                    {slide.title}
                  </h2>
                ) : null}
                {slide.description ? (
                  <p className="text-base text-zinc-600">{slide.description}</p>
                ) : null}
                {slide.linkUrl ? (
                  <a
                    href={slide.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    {slide.linkLabel || "View"}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={goPrevious}
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-zinc-100 sm:flex"
          aria-label="Previous slide"
          disabled={!canNavigate}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-zinc-100 sm:flex"
          aria-label="Next slide"
          disabled={!canNavigate}
        >
          ›
        </button>
      </div>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goTo(index)}
            className={`h-2 w-2 rounded-full transition ${
              index === currentIndex ? "bg-black" : "bg-zinc-300"
            }`}
            disabled={!canNavigate}
          />
        ))}
      </div>
    </div>
  );
}



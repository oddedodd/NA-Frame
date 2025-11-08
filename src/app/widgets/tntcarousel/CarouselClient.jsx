"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Carousel({ items = [] }) {
  const slides = useMemo(() => items.filter(Boolean), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (slides.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-100 p-4 text-center text-sm text-zinc-500">
        No items found. Check that your Google Sheet has data and is published.
      </div>
    );
  }

  const loop = slides.length > 1;

  return (
    <div className="flex w-full flex-col gap-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y, Keyboard]}
        onSwiper={(swiper) =>
          setActiveIndex(swiper.realIndex ?? swiper.activeIndex ?? 0)
        }
        onSlideChange={(swiper) =>
          setActiveIndex(swiper.realIndex ?? swiper.activeIndex ?? 0)
        }
        slidesPerView={1}
        spaceBetween={20}
        loop={loop}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        breakpoints={{
          640: { slidesPerView: Math.min(2, slides.length), spaceBetween: 24 },
          1024: { slidesPerView: Math.min(3, slides.length), spaceBetween: 28 },
          1536: { slidesPerView: Math.min(3, slides.length), spaceBetween: 32 },
        }}
        className="w-full pb-16 [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto! [&_.swiper-pagination]:static! [&_.swiper-pagination]:mt-6 [&_.swiper-pagination]:flex [&_.swiper-pagination]:justify-center [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-zinc-300 [&_.swiper-pagination-bullet-active]:bg-amber-300"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={`${slide.title ?? "slide"}-${index}`}
            className="flex"
          >
            <SlideCard slide={slide} isActive={activeIndex === index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SlideCard({ slide, isActive }) {
  const Wrapper = slide.linkUrl ? "a" : "article";

  return (
    <Wrapper
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
      href={slide.linkUrl || undefined}
      target={slide.linkUrl ? "_blank" : undefined}
      rel={slide.linkUrl ? "noopener noreferrer" : undefined}
    >
      {slide.imageUrl ? (
        <img
          src={slide.imageUrl}
          alt={slide.title || "Carousel image"}
          className="aspect-4/3 w-full flex-none object-cover"
          loading={isActive ? "eager" : "lazy"}
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-4 bg-neutral-900 px-6 pb-6 pt-5">
        {slide.title ? (
          <h2 className="text-lg font-semibold uppercase tracking-wide text-white md:text-xl">
            {slide.title}
          </h2>
        ) : null}
        {slide.description ? (
          <p className="text-sm leading-relaxed text-neutral-200 md:text-base">
            {slide.description}
          </p>
        ) : null}
        {slide.linkUrl ? (
          <span className="mt-auto text-sm font-semibold uppercase tracking-widest text-amber-300 transition group-hover:text-white">
            Les mer
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
}




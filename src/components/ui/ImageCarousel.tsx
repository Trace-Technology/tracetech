"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

export default function ImageCarousel({
  images,
  alt,
  className,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, images.length]);

  if (images.length === 0) return null;

  return (
    <div className={cn("group relative overflow-hidden rounded-xl", className)}>
      <div className="relative aspect-video overflow-hidden bg-zinc-100">
        {images.map((src, i) => (
          <div
            key={src}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              i === current
                ? "opacity-100 translate-x-0"
                : i < current || (current === 0 && i === images.length - 1)
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} - Image ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-red-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-red-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 bg-red-600"
                    : "w-1.5 bg-white/70 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

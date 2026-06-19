'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  url: string;
  caption?: string | null;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = React.useState(initialIndex);

  const next = React.useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = React.useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [next, prev, onClose]);

  const current = images[index];
  if (!current) return null;

  return (
    <div className="lightbox-overlay animate-fade-in" onClick={onClose}>
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X className="h-8 w-8" />
      </button>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
        </>
      )}

      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[75vh]">
          <Image src={current.url} alt={current.caption || 'Gallery image'} fill className="object-contain" sizes="90vw" />
        </div>
        {current.caption && <p className="text-white/90 text-sm mt-4">{current.caption}</p>}
      </div>
    </div>
  );
}

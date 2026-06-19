'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

const CAMPUS_PHOTOS = [
  { src: '/images/campus/campus-1.jpeg', alt: 'Main school building with colourful murals on the boundary wall', caption: 'Main Building — Murals depicting education and culture' },
  { src: '/images/campus/campus-4.webp',  alt: 'Front view of the school entrance with nameplate',             caption: 'School Entrance — Main gate and courtyard' },
  { src: '/images/campus/campus-2.jpeg', alt: 'Administrative block — white two-storey building',              caption: 'Administrative Block — Office & Junior College wing' },
  { src: '/images/campus/campus-3.jpeg', alt: 'Wide view of campus showing both buildings',                    caption: 'Campus Overview — Two buildings side by side' },
];

export function CampusGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  function prev() { setLightbox(i => (i! - 1 + CAMPUS_PHOTOS.length) % CAMPUS_PHOTOS.length); }
  function next() { setLightbox(i => (i! + 1) % CAMPUS_PHOTOS.length); }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Our Campus</span>
          <h2 className="font-serif text-3xl font-bold text-navy mt-2">A Glimpse of School Life</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">
            Located in the heart of Karanja Lad — our campus blends a welcoming environment with vibrant murals celebrating knowledge and community.
          </p>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Large feature photo */}
          <div
            className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group aspect-[4/3]"
            onClick={() => setLightbox(0)}
          >
            <Image
              src={CAMPUS_PHOTOS[0].src}
              alt={CAMPUS_PHOTOS[0].alt}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-xs font-medium drop-shadow">{CAMPUS_PHOTOS[0].caption}</p>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex"><Expand className="h-4 w-4 text-white"/></span>
            </div>
          </div>

          {/* Smaller photos */}
          {CAMPUS_PHOTOS.slice(1).map((photo, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[4/3]"
              onClick={() => setLightbox(i + 1)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-[10px] font-medium drop-shadow line-clamp-1">{photo.caption}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex"><Expand className="h-3.5 w-3.5 text-white"/></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={e => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              <Image
                src={CAMPUS_PHOTOS[lightbox].src}
                alt={CAMPUS_PHOTOS[lightbox].alt}
                fill
                sizes="90vw"
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <p className="text-white/70 text-sm text-center mt-3">{CAMPUS_PHOTOS[lightbox].caption}</p>
            <p className="text-white/40 text-xs text-center mt-1">{lightbox + 1} / {CAMPUS_PHOTOS.length}</p>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={e => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </section>
  );
}

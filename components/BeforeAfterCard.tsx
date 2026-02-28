'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface BeforeAfterCardProps {
  location: string;
  type: string;
  before: string;
  after: string;
  description: string;
}

export default function BeforeAfterCard({ location, type, before, after, description }: BeforeAfterCardProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-full flex flex-col">
      <div
        className="relative aspect-video cursor-ew-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        <img
          src={after}
          alt={`${location} - Après`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={before}
            alt={`${location} - Avant`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-[#C0FF72] cursor-ew-resize shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#C0FF72] rounded-full flex items-center justify-center shadow-lg">
            <div className="flex gap-1">
              <ChevronLeft className="w-4 h-4 text-[#352c5b]" />
              <ChevronRight className="w-4 h-4 text-[#352c5b]" />
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-sm font-semibold text-[#352c5b]">AVANT</p>
        </div>

        <div className="absolute top-4 right-4 bg-[#C0FF72]/90 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-sm font-semibold text-[#352c5b]">APRÈS</p>
        </div>
      </div>

      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#2a2a2a]/70 mb-1.5">
            <MapPin className="w-4 h-4" />
            <p className="text-xs font-medium">{location}</p>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-[#352c5b] mb-1.5">
            {type}
          </h3>
          <p className="text-sm text-[#2a2a2a]/70">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

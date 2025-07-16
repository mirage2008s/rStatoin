'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Play, Pause } from 'lucide-react';
import type { Station } from '@/lib/types';

interface StationCardProps {
  station: Station;
  onPlayPause: () => void;
  isCurrent: boolean;
  isPlaying: boolean;
}

export default function StationCard({
                                      station,
                                      onPlayPause,
                                      isCurrent,
                                      isPlaying,
                                    }: StationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
      <div
          className="h-52 w-40 sm:h-96 sm:w-72 glass-card rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:bg-white/10 group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-28 sm:h-40 overflow-hidden">
          <Image
              src={station.imageUrl}
              alt={station.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              data-ai-hint="radio station abstract"
              priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
          <span className="text-xs text-primary font-bold">
            {station.badge || 'Radio'}
          </span>
          </div>

          {/* Play indicator */}
          {isCurrent && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse shadow-lg" />
          )}
        </div>

        <div className="flex-1 flex flex-col py-1 px-2 sm:p-4 relative">
          <div className="flex items-center justify-between mb-1 sm:mb-1">
            <h3 className="font-semibold text-sm sm:text-lg text-foreground truncate">{station.name}</h3>
          </div>

          <div className="text-xs text-primary/80 mb-1">NOW PLAYING</div>
          <div className="text-xs text-foreground/90 mb-1 line-clamp-2 flex-grow">
            {station.nowPlaying}
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                  onClick={onPlayPause}
                  className="flex items-center rounded-full font-semibold text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/10"
              >
              <span className="flex items-center">
                {isCurrent && isPlaying ? (
                    <Pause className="" />
                ) : (
                    <Play className="" />
                )}
                <span className="hidden sm:inline">
                  {isCurrent && isPlaying ? 'Pause' : 'Tune In'}
                </span>
              </span>
              </Button>

              <button className="p-2 sm:p-3 rounded-full glass-button hover:scale-110 transition-all duration-300">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/70 hover:text-primary" />
              </button>

              <button className="p-2 sm:p-3 rounded-full glass-button hover:scale-110 transition-all duration-300">
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/70 hover:text-primary" />
              </button>
            </div>

            <div className="mt-1 sm:mt-2 border-t border-white/10 flex justify-center">
              <button className="mt-1 text-xs sm:text-sm text-primary/80 hover:text-primary transition-colors duration-300 hover:underline">
                More info ↓
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
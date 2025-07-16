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
          className="h-96 w-72 glass-card rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:bg-white/10 group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-40 overflow-hidden">
          <Image
              src={station.imageUrl}
              alt={station.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              data-ai-hint="radio station abstract"
              priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
          <span className="text-xs text-white font-bold">
            {station.badge || 'Radio'}
          </span>
          </div>

          {/* Play indicator */}
          {isCurrent && (
              <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg" />
          )}
        </div>

        <div className="flex-1 flex flex-col px-6 py-5 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-foreground truncate">{station.name}</h3>
          </div>

          <div className="text-xs text-primary/80 mb-1 font-medium tracking-wide">NOW PLAYING</div>
          <div className="text-sm text-foreground/90 mb-4 line-clamp-2 flex-grow">
            {station.nowPlaying}
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3">
              <Button
                  onClick={onPlayPause}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/10"
              >
              <span className="flex items-center gap-2">
                {isCurrent && isPlaying ? (
                    <Pause className="w-4 h-4" />
                ) : (
                    <Play className="w-4 h-4" />
                )}
                {isCurrent && isPlaying ? 'Pause' : 'Tune In'}
              </span>
              </Button>

              <button className="p-3 rounded-full glass-button hover:scale-110 transition-all duration-300">
                <Heart className="w-4 h-4 text-foreground/70 hover:text-primary" />
              </button>

              <button className="p-3 rounded-full glass-button hover:scale-110 transition-all duration-300">
                <Share2 className="w-4 h-4 text-foreground/70 hover:text-primary" />
              </button>
            </div>

            <div className="border-t border-white/10 pt-3 flex justify-center">
              <button className="text-sm text-primary/80 hover:text-primary font-medium transition-colors duration-300 hover:underline">
                More info ↓
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
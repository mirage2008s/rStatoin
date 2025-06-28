'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="h-96 w-72 bg-card/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-card/90 group">
      <div className="relative h-40">
        <Image
          src={station.imageUrl}
          alt={station.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          data-ai-hint="radio station abstract"
 priority
        />
        <span className="absolute top-3 left-3 bg-primary text-xs text-white font-bold px-3 py-1 rounded-full shadow">
          {station.badge || 'Radio'}
        </span>
      </div>
      <div className="flex-1 flex flex-col px-6 py-4">
        <div className="flex items-center text-primary font-semibold justify-between mb-2">{station.name} </div>
        <div className="text-xs text-primary mb-1">NOW PLAYING</div>
        <div className="text-sm text-primary mb-4">{station.nowPlaying}</div>
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onPlayPause}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-primary relative overflow-hidden transition-all duration-300 shadow-lg hover:scale-105 hover:bg-primary/90"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isCurrent && isPlaying ? (<Pause className="w-5 h-5" />) : (<Play className="w-5 h-5" />)}
                {isCurrent && isPlaying ? 'Pause' : 'Tune In'}
              </span>
            </Button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Heart className="w-5 h-5 text-gray-300" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Share2 className="w-5 h-5 text-gray-300" />
            </button>
          </div>
          <div className="border-t border-gray-700 pt-3 flex justify-center">
            <a href="#" className="text-sm text-primary hover:underline font-medium">
              More info &darr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

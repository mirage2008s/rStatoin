'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="flex flex-col items-center">
      <Card className="relative w-40 h-32 flex flex-col items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="relative w-full h-full">
          <Image
            src={station.imageUrl}
            alt={station.name}
            fill
            className="object-cover"
            data-ai-hint="radio station abstract"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button variant="secondary" size={"icon"}  className="rounded-full w-14 h-12" onClick={(e) => { e.stopPropagation(); onPlayPause(); }}>
              {isCurrent && isPlaying ? (<Pause/>) : (<Play/>)}
            </Button>
          </div>
        </div>
        <div className="absolute bottom-2 text-white text-sm font-bold text-center w-full px-2 truncate">
          {station.name}
        </div>
      </Card>
      {isExpanded && (
        <div className="mt-2 p-4 bg-gray-100 rounded-md w-32 text-center">
          <p className="text-sm">{station.description || "No description available."}</p>
          {/* Add more station information or controls here if needed */}
        </div>
      )}
      </div>
  );
}

'use client';

import type { Station } from '@/lib/types';
import { usePlayerContext } from '@/context/player-context';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Heart, Share2 } from 'lucide-react';

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  const { currentStation, isPlaying, handlePlayPause } = usePlayerContext();

  const isCurrent = currentStation?.id === station.id;
  const isThisCardPlaying = isCurrent && isPlaying;

  return (
    <Card className="flex flex-col h-full min-h-64 glass-card overflow-hidden rounded-xl border-white/20 shadow-lg">
      {/* This content area will grow to fill available space */}
      <CardContent className="p-1 flex-grow">
        {/* A relative container is needed to position the badge correctly. */}
        <div className="relative">
          <div
            className="aspect-video bg-muted rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${station.imageUrl})` }}
          />

          {/* The badge is rendered only if the station has one. */}
          {station.genre && (
            <div className="absolute top-1 left-2 p-1 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg">
              <div className="text-xs text-primary font-bold">{station.genre}</div>
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="font-semibold truncate text-base">{station.name}</h3>
          <p className="text-sm text-foreground/60 truncate">{station.badge}</p>
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <div className="flex items-center gap-1 justify-between">
          <Button
            onClick={() => handlePlayPause(station)}
            className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            {isThisCardPlaying ? <Pause className="" /> : <Play className="" />}
            {isThisCardPlaying ? 'Pause' : 'Tune In'}
          </Button>
          <button className="p-2 rounded-full glass-button">
            <Heart className="h-4 w-4 text-foreground hover:text-primary" />
          </button>

          <button className="p-2 rounded-full glass-button">
            <Share2 className="h-4 w-4 icon text-foreground hover:text-primary" />
          </button>
        </div>

      </CardFooter>
    </Card>
  );
}
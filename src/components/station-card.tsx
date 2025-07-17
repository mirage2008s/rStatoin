'use client';

import type { Station } from '@/lib/types';
import { usePlayerContext } from '@/context/player-context';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  const { currentStation, isPlaying, handlePlayPause } = usePlayerContext();

  const isCurrent = currentStation?.id === station.id;
  const isThisCardPlaying = isCurrent && isPlaying;

  return (
      <Card className="w-full max-w-[200px] sm:max-w-none glass-effect overflow-hidden rounded-xl border-white/20 shadow-lg">
        <CardContent className="p-4">
          <div className="aspect-square bg-muted rounded-lg mb-4 bg-cover bg-center" style={{backgroundImage: `url(${station.imageUrl})`}}/>
          <h3 className="font-semibold truncate text-base">{station.name}</h3>
          <p className="text-sm text-foreground/60 truncate">{station.genre}</p>
        </CardContent>
        <CardFooter className="p-2">
          <Button
              onClick={() => handlePlayPause(station)}
              className="w-full"
              variant={isThisCardPlaying ? 'secondary' : 'default'}
          >
            {isThisCardPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isThisCardPlaying ? 'Pause' : 'Play'}
          </Button>
        </CardFooter>
      </Card>
  );
}
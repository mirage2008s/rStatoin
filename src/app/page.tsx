'use client';

import { useState } from 'react';
import type { Station } from '@/lib/types';
import { initialStations } from '@/lib/stations';
import StationCard from '@/components/station-card';
import Player from '@/components/player';
import { Cctv, Radio } from 'lucide-react';

export default function Home() {
  const [stations] = useState<Station[]>(initialStations);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayPause = (station: Station) => {
    if (currentStation?.id === station.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      <header className="p-6 border-b border-border/40 bg-card/50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Radio className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary font-headline">Explosion of Sound</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-2">🤤Hello from the other side</h2>
          <p className="text-muted-foreground">Discover a variety of radio stations from around the world.</p>
        </div>
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {stations.map(station => (
            <StationCard
              key={station.id}
              station={station}
              onPlayPause={() => handlePlayPause(station)}
              isCurrent={currentStation?.id === station.id}
              isPlaying={currentStation?.id === station.id && isPlaying}
            />
          ))}
        </div>
      </main>

      {currentStation && (
        <Player
          station={currentStation}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import type { Station } from '@/lib/types';
import { initialStations } from '@/lib/stations';
import StationCard from '@/components/station-card';
import Player from '@/components/player';
import AddStationDialog from '@/components/add-station-dialog';
import { Radio } from 'lucide-react';

export default function Home() {
  const [stations, setStations] = useState<Station[]>(initialStations);
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

  const handleUpdateStationTags = (
    stationId: string,
    tags: { genre: string; language: string }
  ) => {
    setStations(prevStations =>
      prevStations.map(s =>
        s.id === stationId ? { ...s, genre: tags.genre, language: tags.language } : s
      )
    );
  };

  const handleAddStation = (newStationData: { name: string; streamUrl: string }) => {
    const newStation: Station = {
      ...newStationData,
      id: crypto.randomUUID(),
      imageUrl: 'https://placehold.co/300x200.png',
    };
    setStations(prevStations => [...prevStations, newStation]);
  };
  
  const playingStation = useMemo(() => isPlaying ? currentStation : null, [isPlaying, currentStation]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      <header className="p-6 border-b border-border/40 bg-card/50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Radio className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary font-headline">AudioCaster</h1>
          </div>
          <AddStationDialog onAddStation={handleAddStation} />
        </div>
      </header>

      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 font-headline">Stations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stations.map(station => (
            <StationCard
              key={station.id}
              station={station}
              onPlayPause={() => handlePlayPause(station)}
              isCurrent={currentStation?.id === station.id}
              isPlaying={currentStation?.id === station.id && isPlaying}
              onUpdateStationTags={handleUpdateStationTags}
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

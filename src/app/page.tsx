'use client';

import { useState } from 'react';
import type { Station } from '@/lib/types';
import { initialStations } from '@/lib/stations';
import StationCard from '@/components/station-card';
import Player from '@/components/player';
import { Radio } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 text-foreground pb-28 relative overflow-hidden">
            {/* Background blur elements for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-float" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '3s' }} />

            <header className="relative z-10 p-4 sm:p-6 glass-effect border-b border-white/10">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm">
                            <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-headline">
                            Explosion of Sound
                        </h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 relative z-10">
                <div className="mb-6 sm:mb-8 text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-2">🤤 Hello from the other side</h2>
                    <p className="text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto">
                        Discover a variety of radio stations from around the world.
                    </p>
                </div>

                {/* Responsive grid layout for better mobile experience */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 sm:gap-6 justify-items-center">
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
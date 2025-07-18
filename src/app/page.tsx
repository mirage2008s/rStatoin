'use client';

import StationCard from '@/components/station-card';
import Player from '@/components/player';
import { usePlayerContext } from '@/context/player-context';
import { Radio } from 'lucide-react';
import type { Station } from '@/lib/types';

export default function Home() {
    const { stations, currentStation } = usePlayerContext();

    // Group stations by their genre for categorized display.
    const stationsByCategory = stations.reduce((acc, station) => {
        const category = station.category || 'Uncategorized'; // Default category
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(station);
        return acc;
    }, {} as Record<string, Station[]>);

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

            <main className="container mx-auto py-4 sm:py-6 relative z-10">
                <div className="mb-6 sm:mb-8 text-center px-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-2"> Hello from the other side</h2>
                    <p className="text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto">
                        Discover a variety of radio stations from around the world.
                    </p>
                </div>

                <div className="space-y-10">
                    {Object.entries(stationsByCategory).map(([category, stationsInCategory]) => (
                        <section className="p-2" key={category}>
                            <h2 className="text-xl text-primary font-bold tracking-tight mb-2 px-2 sm:px-0">{category}</h2>
                            <div className="relative">
                                {/* This container enables horizontal scrolling on overflow. */}
                                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                                    {stationsInCategory.map(station => (
                                        // Each card is wrapped to control its size and prevent shrinking.
                                        <div key={station.id} className="w-48 flex-shrink-0">
                                            <StationCard station={station} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* The player remains fixed at the bottom if a station is selected. */}
            {currentStation && <Player />}
        </div>
    );
}
'use client';

import StationCard from '@/components/station-card';
import Player from '@/components/player';
import { usePlayerContext } from '@/context/player-context';
import { Disc3 } from 'lucide-react';
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
        <div className="min-h-screen text-foreground pb-28 relative overflow-hidden">
            {/* Background blur elements for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-bg-darkg" />
            
            <header className="relative z-10 p-4 sm:p-6 glass-effect">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 rounded-xl">
                            <Disc3 className="w-12 h-12" />
                        </div>
                        <h1 className="text-xl sm:text-3xl font-bold font-headline sgradient-text">
                            Explosion of Sound
                        </h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-4 sm:py-6 relative z-10">
                <div className="mb-6 sm:mb-8 text-center px-4">
                    <h2 className="text-xl sm:text-2xl font-semibold sgradient-text mb-2"> Hello from the other side</h2>
                    <p className="text-sm sm:text-base text-foreground max-w-2xl mx-auto">
                        Discover a variety of radio stations from around the world.
                    </p>
                </div>

                <div className="space-y-6">
                    {Object.entries(stationsByCategory).map(([category, stationsInCategory]) => (
                        <section className="p-2" key={category}>
                           <div className="flex items-end">
                                <h2 className="section-title">{category}</h2>
                                <h2 className="flex-1 border-b border-white/20 mb-6"></h2>
                            </div>
                            <div className="relative">
                                {/* This container enables horizontal scrolling on overflow. */}
                                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                                    {stationsInCategory.map(station => (
                                        // Each card is wrapped to control its size and prevent shrinking.
                                        <div key={station.id} className="">
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
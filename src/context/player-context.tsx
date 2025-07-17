'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Station } from '@/lib/types';
import { initialStations } from '@/lib/stations';

interface PlayerContextType {
    stations: Station[];
    currentStation: Station | null;
    isPlaying: boolean;
    handlePlayPause: (station: Station) => void;
    togglePlayPause: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
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

    const togglePlayPause = () => {
        if (currentStation) {
            setIsPlaying(!isPlaying);
        }
    };

    const value = {
        stations,
        currentStation,
        isPlaying,
        handlePlayPause,
        togglePlayPause,
    };

    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayerContext() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayerContext must be used within a PlayerProvider');
    }
    return context;
}
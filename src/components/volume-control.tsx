'use client';

import { useState, useEffect, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';

// Define the props that this component accepts.
interface VolumeControlProps {
    audioRef: RefObject<HTMLAudioElement>;
}

/**
 * A component that provides UI and logic for controlling the volume
 * of the audio player.
 */
export default function VolumeControl({ audioRef }: VolumeControlProps) {
    // State to manage the volume level (0 to 1).
    const [volume, setVolume] = useState(1);
    // State to track whether the audio is muted.
    const [isMuted, setIsMuted] = useState(false);

    // Effect to update the audio element's volume whenever the state changes.
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            // If muted, set volume to 0, otherwise use the state value.
            audio.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted, audioRef]);

    // Toggles the mute state.
    const handleMuteToggle = () => {
        setIsMuted(prev => !prev);
    };

    // Handles volume changes from the slider component.
    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        // If volume is adjusted, unmute if it was muted.
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    };

    return (
        <div className="flex items-center gap-2 w-32">
            <Button
                onClick={handleMuteToggle}
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-white/20"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
                max={1}
                step={0.05}
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                className="w-full"
                aria-label="Volume slider"
            />
        </div>
    );
}
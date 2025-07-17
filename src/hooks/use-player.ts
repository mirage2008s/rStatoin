import { useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';
import type { Station } from '@/lib/types';
import { useToast } from './use-toast';

/**
 * Custom hook to manage audio playback logic, including HLS streaming.
 * @param station The station to play.
 * @param isPlaying Whether the station should be playing.
 * @param onPlayPause Callback to toggle play/pause state.
 * @returns An audio ref and the current loading state.
 */
export const usePlayer = (
    station: Station,
    isPlaying: boolean,
    onPlayPause: (station?: Station) => void
) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set up event listeners to track the loading state of the audio.
        const handleLoading = () => setIsLoading(true);
        const handlePlaying = () => setIsLoading(false);

        audio.addEventListener('waiting', handleLoading);
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('canplay', handlePlaying);

        const isM3u8 = station.streamUrl.endsWith('.m3u8');

        // Function to set up and play an HLS stream.
        const playHlsStream = async () => {
            handleLoading();
            try {
                const HlsModule = await import('hls.js');
                const Hls = HlsModule.default;

                if (Hls.isSupported()) {
                    // Destroy any existing HLS instance before creating a new one.
                    if (hlsRef.current) {
                        hlsRef.current.destroy();
                    }
                    const hls = new Hls();
                    hlsRef.current = hls;
                    hls.loadSource(station.streamUrl);
                    hls.attachMedia(audio);

                    // Once the manifest is parsed, play the audio.
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        audio.play().catch(handlePlaybackError);
                    });

                    // Handle fatal HLS errors.
                    hls.on(Hls.Events.ERROR, (event, data) => {
                        if (data.fatal) {
                            console.error('HLS fatal error:', data);
                            toast({
                                variant: 'destructive',
                                title: 'Playback Error',
                                description: 'A streaming error occurred.',
                            });
                            onPlayPause(); // Stop playback on fatal error.
                        }
                    });
                } else {
                    // Fallback for browsers that don't support HLS.js.
                    playStandardStream();
                }
            } catch (error) {
                console.error('Failed to load hls.js:', error);
                playStandardStream();
            }
        };

        // Function to play a standard audio stream.
        const playStandardStream = () => {
            handleLoading();
            // Ensure no HLS instance is active.
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            // Set the source and play.
            if (audio.src !== station.streamUrl) {
                audio.src = station.streamUrl;
            }
            audio.play().catch(handlePlaybackError);
        };

        // Generic error handler for playback issues.
        const handlePlaybackError = (e: Error) => {
            console.error('Error playing audio:', e);
            toast({
                variant: 'destructive',
                title: 'Playback Error',
                description: 'Could not play the selected station.',
            });
            onPlayPause(); // Stop playback on error.
        };

        // Main logic to decide whether to play or pause.
        if (isPlaying) {
            if (isM3u8) {
                playHlsStream();
            } else {
                playStandardStream();
            }
        } else {
            audio.pause();
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (audio.src) {
                audio.src = ''; // Clear source when paused to stop buffering.
            }
            setIsLoading(false);
        }

        // Cleanup function to remove listeners and destroy HLS instance.
        return () => {
            audio.removeEventListener('waiting', handleLoading);
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('canplay', handlePlaying);
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, [isPlaying, station, onPlayPause, toast]);

    return { audioRef, isLoading };
};
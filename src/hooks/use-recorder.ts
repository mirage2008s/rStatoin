import { useState, useRef, RefObject } from 'react';
import type { Station } from '@/lib/types';
import { useToast } from './use-toast';

/**
 * Custom hook to manage audio recording functionality.
 * @param audioRef A ref to the audio element being played.
 * @param station The station being recorded.
 * @returns Recording state and a function to toggle recording.
 */
export const useRecorder = (
    audioRef: RefObject<HTMLAudioElement>,
    station: Station
) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const { toast } = useToast();

    // Function to start the recording process.
    const startRecording = () => {
        const audio = audioRef.current;
        if (!audio || audio.paused) {
            toast({
                variant: 'destructive',
                title: 'Recording Error',
                description: 'A station must be playing to start a recording.',
            });
            return;
        }

        try {
            // Create a stream from the audio element.
            // @ts-ignore - mozCaptureStream is a vendor-prefixed API.
            const stream = audio.captureStream ? audio.captureStream() : audio.mozCaptureStream();
            if (!stream) throw new Error('Stream capture is not supported in this browser.');

            mediaRecorderRef.current = new MediaRecorder(stream);
            recordedChunksRef.current = [];

            // When data is available, push it to our chunks array.
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            // When recording stops, create a downloadable file.
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${station.name}-recording-${new Date().toISOString()}.webm`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            toast({ title: 'Recording Started', description: `Recording ${station.name}.` });
        } catch (e: any) {
            console.error('Error starting recording:', e);
            toast({
                variant: 'destructive',
                title: 'Recording Failed',
                description: e.message || 'Your browser might not support this feature.',
            });
        }
    };

    // Function to stop the recording.
    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            toast({ title: 'Recording Stopped', description: 'Your recording is downloading.' });
        }
    };

    // Toggles between starting and stopping the recording.
    const handleRecordToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return { isRecording, handleRecordToggle };
};
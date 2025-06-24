'use client';

import { useEffect, useRef, useState } from 'react';
import type { Station } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Mic, Square, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlayerProps {
  station: Station;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function Player({ station, isPlaying, onPlayPause }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (audio.src !== station.streamUrl) {
        audio.src = station.streamUrl;
        audio.crossOrigin = 'anonymous';
      }
      audio.play().catch(e => {
        console.error("Error playing audio:", e);
        toast({
            variant: "destructive",
            title: "Playback Error",
            description: "Could not play the selected station."
        });
        onPlayPause(); // Toggle state back
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, station.streamUrl, onPlayPause, toast]);
  
  const startRecording = () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) {
      toast({
        variant: "destructive",
        title: "Recording Error",
        description: "Please play a station before recording.",
      });
      return;
    }

    try {
      // @ts-ignore
      const stream = audio.captureStream() || audio.mozCaptureStream();
      if (!stream) throw new Error("Stream capture not supported");
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
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
      toast({ title: "Recording Started", description: `Recording ${station.name}.` });
    } catch(e) {
        console.error("Error starting recording:", e);
        toast({
            variant: "destructive",
            title: "Recording Error",
            description: "Could not start recording. Your browser might not be supported.",
        });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: "Recording Stopped", description: "Your recording is being downloaded." });
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 z-50">
      <audio ref={audioRef} id="audio-player" />
      <Card className="container mx-auto p-3 sm:p-4 shadow-2xl bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className='flex-shrink min-w-0'>
            <p className="font-semibold text-primary truncate">{station.name}</p>
            <p className="text-sm text-muted-foreground">Now playing</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={onPlayPause} size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
            <Button onClick={handleRecordToggle} size="icon" variant={isRecording ? "destructive" : "outline"} className="rounded-full w-12 h-12">
              {isRecording ? <Square className="h-5 w-5 fill-white" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

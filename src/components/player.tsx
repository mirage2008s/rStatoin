'use client';

import { useEffect, useRef, useState } from 'react';
import type { Station } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Mic, Square, Loader, Plus, Minus, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type Hls from 'hls.js';

interface PlayerProps {
  station: Station;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function Player({ station, isPlaying, onPlayPause }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    console.log("Audio volume:", audio?.volume);
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

        // Only create AudioContext and nodes once
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();

      // Set gain based on station (example: boost for station.id === '5')
      gainNodeRef.current.gain.value = (station.id === '1' || station.id === '2' || station.id === '3') ? 5.0 : 1.0;

      // Only create source node once
      if (!sourceNodeRef.current) {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audio);
        sourceNodeRef.current.connect(gainNodeRef.current).connect(audioContextRef.current.destination);
      }
    } else if (gainNodeRef.current) {
      // Update gain if station changes
      gainNodeRef.current.gain.value = (station.id === '1' || station.id === '2' || station.id === '3') ? 5.0 : 1.0;
    }

    // Add loading event listeners
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => setIsLoading(false);

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);

    const isM3u8 = station.streamUrl.endsWith('.m3u8');

    const playHlsStream = async () => {
      try {
        const HlsModule = await import('hls.js');
        const Hls = HlsModule.default;
        if (Hls.isSupported()) {
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(station.streamUrl);
          hls.attachMedia(audio);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch(e => {
              console.error("Error playing HLS audio:", e);
              toast({
                variant: "destructive",
                title: "Playback Error",
                description: "Could not play the selected station."
              });
              onPlayPause();
            });
          });
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('HLS fatal error:', data);
              toast({
                variant: "destructive",
                title: "Playback Error",
                description: "An error occurred with the HLS stream."
              });
              onPlayPause();
            }
          });
        } else {
          playStandardStream();
        }
      } catch (error) {
        console.error("Failed to load hls.js", error);
        playStandardStream();
      }
    };

    const playStandardStream = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (audio.src !== station.streamUrl) {
        audio.src = station.streamUrl;
      }
      audio.play().catch(e => {
        console.error("Error playing audio:", e);
        toast({
          variant: "destructive",
          title: "Playback Error",
          description: "Could not play the selected station."
        });
        onPlayPause();
      });
    };

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
        audio.src = '';
      }
    }

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    }

  }, [isPlaying, station, onPlayPause, toast]);

  // Update audio volume when volume state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeUp = () => {
    const newVolume = Math.min(volume + 0.1, 1);
    setVolume(newVolume);
    setIsMuted(false);
  };

  const handleVolumeDown = () => {
    const newVolume = Math.max(volume - 0.1, 0);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

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
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <audio ref={audioRef} id="audio-player" crossOrigin="anonymous" />
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-effect border-white/20 shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-white/5 to-white/10">
              <div className="flex items-center justify-between gap-4">
                <div className='flex-shrink min-w-0'>
                  <p className="font-semibold text-lg text-foreground truncate">{station.name}</p>
                  <p className="text-sm text-foreground/70">Now playing</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">

                  {/*<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">*/}
                  {/*  <Button*/}
                  {/*      onClick={handleVolumeDown}*/}
                  {/*      size="sm"*/}
                  {/*      variant="ghost"*/}
                  {/*      className="rounded-full w-8 h-8 p-0 hover:bg-white/20 transition-colors"*/}
                  {/*  >*/}
                  {/*    <Minus className="h-4 w-4" />*/}
                  {/*  </Button>*/}

                  {/*  <Button*/}
                  {/*      onClick={handleMuteToggle}*/}
                  {/*      size="sm"*/}
                  {/*      variant="ghost"*/}
                  {/*      className="rounded-full w-8 h-8 p-0 hover:bg-white/20 transition-colors"*/}
                  {/*  >*/}
                  {/*    <Volume2 className={`h-4 w-4 ${isMuted ? 'text-red-400' : ''}`} />*/}
                  {/*  </Button>*/}

                  {/*  <Button*/}
                  {/*      onClick={handleVolumeUp}*/}
                  {/*      size="sm"*/}
                  {/*      variant="ghost"*/}
                  {/*      className="rounded-full w-8 h-8 p-0 hover:bg-white/20 transition-colors"*/}
                  {/*  >*/}
                  {/*    <Plus className="h-4 w-4" />*/}
                  {/*  </Button>*/}

                  {/*  <span className="text-xs text-foreground/70 min-w-[3rem] text-center">*/}
                  {/*    {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}*/}
                  {/*  </span>*/}
                  {/*</div>*/}

                  <Button
                      onClick={onPlayPause}
                      className="rounded-full w-14 h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/10"
                      disabled={isLoading}
                  >
                    {isLoading ? (
                        <Loader className="animate-spin w-6 h-6"/>
                    ) : isPlaying ? (
                        <Pause className="h-6 w-6" />
                    ) : (
                        <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>

                  <Button
                      onClick={handleRecordToggle}
                      size="icon"
                      variant={isRecording ? "destructive" : "outline"}
                      className={`rounded-full w-14 h-14 transition-all duration-300 transform hover:scale-105 ${
                          isRecording
                              ? 'bg-red-500/80 backdrop-blur-sm border-red-400/30 hover:bg-red-500/70'
                              : 'glass-button hover:bg-white/20'
                      }`}
                  >
                    {isRecording ? (
                        <Square className="h-5 w-5 fill-white" />
                    ) : (
                        <Mic className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
  );
}
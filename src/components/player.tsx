'use client';

import { usePlayerContext } from '@/context/player-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Mic, Square, Loader } from 'lucide-react';
import { usePlayer } from '@/hooks/use-player';
import { useRecorder } from '@/hooks/use-recorder';
import VolumeControl from './volume-control';

export default function Player() {
  const { currentStation, isPlaying, togglePlayPause } = usePlayerContext();

  // If there's no station, don't render the player
  if (!currentStation) return null;

  const { audioRef, isLoading } = usePlayer(currentStation, isPlaying, togglePlayPause);
  const { isRecording, handleRecordToggle } = useRecorder(audioRef, currentStation);

  return (
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <audio ref={audioRef} id="audio-player" crossOrigin="anonymous" />
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-effect border-white/20 shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-white/5 to-white/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-shrink min-w-0">
                  <p className="font-semibold text-lg text-foreground truncate">{currentStation.name}</p>
                  <p className="text-sm text-foreground/70">Now playing</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <VolumeControl audioRef={audioRef} />
                  <Button
                      onClick={togglePlayPause}
                      size="lg"
                      className="rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-110 shadow-lg"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button
                      onClick={handleRecordToggle}
                      size="sm"
                      variant="ghost"
                      className={`rounded-full w-10 h-10 p-0 transition-colors ${isRecording ? 'bg-red-500/80 text-white' : 'hover:bg-white/20'}`}
                      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
  );
}
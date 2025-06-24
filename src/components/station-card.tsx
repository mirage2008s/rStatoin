'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Loader2, Music, Languages } from 'lucide-react';
import type { Station } from '@/lib/types';
import { detectStationGenreAndLanguage } from '@/ai/flows/tag-station';
import { useToast } from '@/hooks/use-toast';

interface StationCardProps {
  station: Station;
  onPlayPause: () => void;
  isCurrent: boolean;
  isPlaying: boolean;
  onUpdateStationTags: (stationId: string, tags: { genre: string; language: string }) => void;
}

export default function StationCard({
  station,
  onPlayPause,
  isCurrent,
  isPlaying,
  onUpdateStationTags,
}: StationCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    let audio: HTMLAudioElement | null = null;
    let recorder: MediaRecorder | null = null;

    try {
      audio = new Audio(station.streamUrl);
      audio.crossOrigin = 'anonymous';
      audio.muted = true;
      await audio.play();

      // @ts-ignore
      const stream = audio.captureStream() || audio.mozCaptureStream();
      if (!stream) {
        throw new Error('Could not capture audio stream.');
      }
      
      recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = event => audioChunks.push(event.data);

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          try {
            const result = await detectStationGenreAndLanguage({ audioDataUri: base64data });
            onUpdateStationTags(station.id, result);
          } catch (e) {
            console.error('AI analysis failed:', e);
            toast({
              variant: 'destructive',
              title: 'Analysis Failed',
              description: 'Could not determine genre and language for this station.',
            });
          } finally {
            setIsAnalyzing(false);
          }
        };
      };

      recorder.start();
      setTimeout(() => {
        recorder?.stop();
        audio?.pause();
      }, 10000); // Record for 10 seconds

    } catch (error) {
      console.error('Error during analysis setup:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not start analysis. The stream might be inaccessible.',
      });
      setIsAnalyzing(false);
      audio?.pause();
      if (recorder && recorder.state !== 'inactive') recorder.stop();
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative w-full h-40">
          <Image
            src={station.imageUrl}
            alt={station.name}
            fill
            className="object-cover"
            data-ai-hint="radio station abstract"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
             <CardTitle className="text-white font-headline text-xl">{station.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {station.genre && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              {station.genre}
            </Badge>
          )}
          {station.language && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Languages className="w-3 h-3" />
              {station.language}
            </Badge>
          )}
        </div>
        {!station.genre && !station.language && (
          <p className="text-sm text-muted-foreground">No tags available. Use the analyzer to generate them.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-muted/50">
        <Button onClick={onPlayPause} size="sm" variant="default" className="w-24">
          {isCurrent && isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Play
            </>
          )}
        </Button>
        <Button onClick={handleAnalyze} disabled={isAnalyzing} size="sm" variant="outline" className="w-28">
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Analyze'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

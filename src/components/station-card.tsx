'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';
import type { Station } from '@/lib/types';

interface StationCardProps {
  station: Station;
  onPlayPause: () => void;
  isCurrent: boolean;
  isPlaying: boolean;
}

export default function StationCard({
  station,
  onPlayPause,
  isCurrent,
  isPlaying,
}: StationCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 flex-grow">
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
      <CardContent className="flex-grow p-4">
        <p className="text-sm text-muted-foreground">Click play to start listening.</p>
      </CardContent>
      <CardFooter className="flex justify-start p-4 bg-muted/50">
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
      </CardFooter>
    </Card>
  );
}

import type { Station } from './types';

export const initialStations: Station[] = [
  {
    id: '1',
    name: 'KUTX 98.9',
    streamUrl: 'https://kut.stream.publicradio.org/kutx_live.mp3',
    imageUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: '2',
    name: 'VRT Studio Brussel',
    streamUrl: 'https://icecast.vrt.be/stubru-high.mp3',
    imageUrl: 'https://placehold.co/300x200.png',
  }
];

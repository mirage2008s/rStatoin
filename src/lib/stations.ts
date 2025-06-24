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
  },
  {
    id: '3',
    name: '977 Hitz',
    streamUrl: 'https://19353.live.streamtheworld.com/977_HITZ_SC',
    imageUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: '4',
    name: 'Radio Paradise',
    streamUrl: 'http://stream.radioparadise.com/flac',
    imageUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: '5',
    name: 'Lofi Girl',
    streamUrl: 'https://stream.lofi.live/lofi',
    imageUrl: 'https://placehold.co/300x200.png',
  },
    {
    id: '6',
    name: 'SomaFM Groove Salad',
    streamUrl: 'https://ice1.somafm.com/groovesalad-256-mp3',
    imageUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: '7',
    name: 'Classic Rock Florida',
    streamUrl: 'https://ice-query.link-server.com:8020/stream.mp3',
    imageUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: '8',
    name: 'NTS Radio',
    streamUrl: 'https://stream-relay-geo.ntslive.net/stream',
    imageUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: '9',
    name: 'CBS News',
    streamUrl: 'https://cbs-news-2-samsung.amagi.tv/playlist.m3u8',
    imageUrl: 'https://placehold.co/300x200.png',
    genre: 'News',
    language: 'English',
  }
];

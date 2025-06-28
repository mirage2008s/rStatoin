import type { Station } from './types';

export const initialStations: Station[] = [
  {
    id: '1',
    name: 'VOV1',
    streamUrl: 'https://stream-cdn.vov.vn/live/vov1-audio_only.m3u8',
    imageUrl: '/images/vov1.png',
    genre: 'News',
    badge: 'Radio',
  },
  {
    id: '2',
    name: 'VOV2',
    streamUrl: 'https://str.vov.gov.vn/vovlive/vov2.sdp_aac/chunklist_w1592569258.m3u8',
    imageUrl: '/images/vov2.png',
    genre: 'News',
    badge: 'Radio',
  },
  {
    id: '3',
    name: 'VOV3',
    streamUrl: 'https://str.vov.gov.vn/vovlive/vov3.sdp_aac/chunklist_w1816496431.m3u8',
    imageUrl: '/images/xfm-w.jpg',
    genre: 'News',
    badge: 'Radio',
  },
  {
    id: '4',
    name: 'VPOP - Zing Live',
    streamUrl: 'https://vnso-pt-48-tf-multi-playlist-zmp3.zmdcdn.me/JB2zPitWC-s/zhls/playback-realtime/audio/6ddadf76e3330a6d5322/audio.m3u8',
    imageUrl: 'https://placehold.co/600x400.png',
    genre: 'VPop',
    badge: 'Zing MP3',
    nowPlaying: 'Tramlee - You better run run!',
  },
  {
    id: '5',
    name: 'USUK - Zing Live',
    streamUrl: 'https://vnso-pt-37-tf-multi-playlist-zmp3.zmdcdn.me/5k37-bBNjIU/zhls/playback-realtime/audio/f49e38320477ed29b466/audio.m3u8',
    imageUrl: 'https://placehold.co/600x400.png',
    genre: 'US-UK',
    badge: 'Radio',
  },
  {
    id: '6',
    name: 'Acoustic - Zing Live',
    streamUrl: 'https://vnso-pt-53-tf-multi-playlist-zmp3.zmdcdn.me/4TX5Vj5v__E/zhls/playback-realtime/audio/9b7b55d7699280ccd983/audio.m3u8',
    imageUrl: 'https://placehold.co/600x400.png',
    genre: 'Acoustic',
    badge: 'Zing MP3',
  }
];
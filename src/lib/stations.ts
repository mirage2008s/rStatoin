import type { Station } from './types';

export const initialStations: Station[] = [
  {
    id: '1',
    name: 'VOV3',
    streamUrl: 'https://str.vov.gov.vn/vovlive/vov3.sdp_aac/chunklist_w1816496431.m3u8',
    imageUrl: 'https://vov3.vov.vn/themes/custom/vov_3_new/images/logo/vov3_logo.svg',
  },
  {
    id: '2',
    name: 'Zing MP3 - VN Radio',
    streamUrl: 'https://vnso-pt-48-tf-multi-playlist-zmp3.zmdcdn.me/JB2zPitWC-s/zhls/playback-realtime/audio/6ddadf76e3330a6d5322/audio.m3u8',
    imageUrl: 'https://placehold.co/300x200.png',
  }
];
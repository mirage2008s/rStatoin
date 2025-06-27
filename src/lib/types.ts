export type Station = {
  id: string;
  name: string;
  streamUrl: string;
  imageUrl: string | "https://via.placeholder.com/150";
  genre?: string;
  language?: string;
  badge?: string;
  nowPlaying?: string
};

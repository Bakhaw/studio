export type Queue = {
  currentlyPlaying: SpotifyApi.TrackObjectFull;
  queue: SpotifyApi.TrackObjectFull[];
};

export type Track =
  | SpotifyApi.TrackObjectFull
  | SpotifyApi.TrackObjectSimplified
  | SpotifyApi.EpisodeObject;

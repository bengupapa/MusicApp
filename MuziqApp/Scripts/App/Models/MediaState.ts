module musicApp.Models {
    export class MediaState {
        constructor() { }

        public SongId: string
        public SongName: string;

        public AlbumId: string;
        public AlbumName: string;

        public ArtistId: string;
        public ArtistName: string;

        public State: Constants.PlayState;
        public Volume: number;
        public Mode: Constants.RepeatMode;
        public TrackTimespan: Models.TrackTimespan;
    }
}
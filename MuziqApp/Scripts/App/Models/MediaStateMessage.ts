module musicApp.Models {
    export class MediaStateMessage {
        constructor() { }

        public SongId: string;
        public State: Constants.PlayState;
    }
}
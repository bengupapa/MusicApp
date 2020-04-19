module musicApp.Core {
    export class MessageHandlerRegistry {
        constructor() { };

        public static handler(type: Constants.MessageType): IMessageHandler {
            switch (type) {
                case Constants.MessageType.MediaStateMessage:
                    return MediaStateMessageHandler.Instance();
                case Constants.MessageType.ProgressTimer:
                    return TimeProgressMessageHandler.Instance();
                case Constants.MessageType.TrackDetails:
                    return TrackDetailsMessageHandler.Instance();
            }
        }
    }

    export interface IMessageHandler {
        processMessage(facadeCtrl: Controllers.FacadeController, message: Models.Message): void
    }

    export class MediaStateMessageHandler implements IMessageHandler {

        private static mediaStateMessageHandler: MediaStateMessageHandler = null;

        public processMessage(facadeCtrl: Controllers.FacadeController, message: Models.Message) {
            let stateMsg: Models.MediaStateMessage = <Models.MediaStateMessage>message.MessageObj
            facadeCtrl.updateStateLabel(stateMsg);
            facadeCtrl.updatePlayButtonSate(stateMsg.State);
        }

        public static Instance(): IMessageHandler {
            return this.mediaStateMessageHandler != null ?
                this.mediaStateMessageHandler :
                (this.mediaStateMessageHandler = new MediaStateMessageHandler());
        }
    }

    export class TimeProgressMessageHandler implements IMessageHandler {

        private static timeProgressMessageHandler: TimeProgressMessageHandler = null;

        public processMessage(facadeCtrl: Controllers.FacadeController, message: Models.Message) {
            facadeCtrl.updateProgressBarPosition(<Models.TrackTimespan>message.MessageObj);
        }

        public static Instance(): IMessageHandler {
            return this.timeProgressMessageHandler != null ?
                this.timeProgressMessageHandler :
                (this.timeProgressMessageHandler = new TimeProgressMessageHandler());
        }
    }

    export class TrackDetailsMessageHandler implements IMessageHandler {

        private static trackDetailsMessageHandler: TrackDetailsMessageHandler = null;

        public processMessage(facadeCtrl: Controllers.FacadeController, message: Models.Message) {
            let mediaState: Models.MediaState = <Models.MediaState>message.MessageObj;
            let playType: Constants.PlayViewType = facadeCtrl.getCurrentViewType();
            if (playType == Constants.PlayViewType.CurrentlyPlaying) {
                musicApp.Controllers.MusicController.getCurrentlyPlayingTrackView(mediaState);
            }

            facadeCtrl.storeAndHighlightSelectedArtist(mediaState.ArtistId);
            facadeCtrl.storeAndHightSelectedAlbum(mediaState.AlbumId);
            facadeCtrl.storeAndHighlightSelectedSong(mediaState.SongId);
        }

        public static Instance(): IMessageHandler {
            return this.trackDetailsMessageHandler != null ?
                this.trackDetailsMessageHandler :
                (this.trackDetailsMessageHandler = new TrackDetailsMessageHandler())
        }
    }
}
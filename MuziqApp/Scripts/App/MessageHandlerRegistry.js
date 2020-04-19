var musicApp;
(function (musicApp) {
    var Core;
    (function (Core) {
        var MessageHandlerRegistry = /** @class */ (function () {
            function MessageHandlerRegistry() {
            }
            ;
            MessageHandlerRegistry.handler = function (type) {
                switch (type) {
                    case musicApp.Constants.MessageType.MediaStateMessage:
                        return MediaStateMessageHandler.Instance();
                    case musicApp.Constants.MessageType.ProgressTimer:
                        return TimeProgressMessageHandler.Instance();
                    case musicApp.Constants.MessageType.TrackDetails:
                        return TrackDetailsMessageHandler.Instance();
                }
            };
            return MessageHandlerRegistry;
        }());
        Core.MessageHandlerRegistry = MessageHandlerRegistry;
        var MediaStateMessageHandler = /** @class */ (function () {
            function MediaStateMessageHandler() {
            }
            MediaStateMessageHandler.prototype.processMessage = function (facadeCtrl, message) {
                var stateMsg = message.MessageObj;
                facadeCtrl.updateStateLabel(stateMsg);
                facadeCtrl.updatePlayButtonSate(stateMsg.State);
            };
            MediaStateMessageHandler.Instance = function () {
                return this.mediaStateMessageHandler != null ?
                    this.mediaStateMessageHandler :
                    (this.mediaStateMessageHandler = new MediaStateMessageHandler());
            };
            MediaStateMessageHandler.mediaStateMessageHandler = null;
            return MediaStateMessageHandler;
        }());
        Core.MediaStateMessageHandler = MediaStateMessageHandler;
        var TimeProgressMessageHandler = /** @class */ (function () {
            function TimeProgressMessageHandler() {
            }
            TimeProgressMessageHandler.prototype.processMessage = function (facadeCtrl, message) {
                facadeCtrl.updateProgressBarPosition(message.MessageObj);
            };
            TimeProgressMessageHandler.Instance = function () {
                return this.timeProgressMessageHandler != null ?
                    this.timeProgressMessageHandler :
                    (this.timeProgressMessageHandler = new TimeProgressMessageHandler());
            };
            TimeProgressMessageHandler.timeProgressMessageHandler = null;
            return TimeProgressMessageHandler;
        }());
        Core.TimeProgressMessageHandler = TimeProgressMessageHandler;
        var TrackDetailsMessageHandler = /** @class */ (function () {
            function TrackDetailsMessageHandler() {
            }
            TrackDetailsMessageHandler.prototype.processMessage = function (facadeCtrl, message) {
                var mediaState = message.MessageObj;
                var playType = facadeCtrl.getCurrentViewType();
                if (playType == musicApp.Constants.PlayViewType.CurrentlyPlaying) {
                    musicApp.Controllers.MusicController.getCurrentlyPlayingTrackView(mediaState);
                }
                facadeCtrl.storeAndHighlightSelectedArtist(mediaState.ArtistId);
                facadeCtrl.storeAndHightSelectedAlbum(mediaState.AlbumId);
                facadeCtrl.storeAndHighlightSelectedSong(mediaState.SongId);
            };
            TrackDetailsMessageHandler.Instance = function () {
                return this.trackDetailsMessageHandler != null ?
                    this.trackDetailsMessageHandler :
                    (this.trackDetailsMessageHandler = new TrackDetailsMessageHandler());
            };
            TrackDetailsMessageHandler.trackDetailsMessageHandler = null;
            return TrackDetailsMessageHandler;
        }());
        Core.TrackDetailsMessageHandler = TrackDetailsMessageHandler;
    })(Core = musicApp.Core || (musicApp.Core = {}));
})(musicApp || (musicApp = {}));
//# sourceMappingURL=MessageHandlerRegistry.js.map
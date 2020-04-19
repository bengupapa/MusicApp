var musicApp;
(function (musicApp) {
    var Constants;
    (function (Constants) {
        var PlayState;
        (function (PlayState) {
            PlayState[PlayState["Undefined"] = 0] = "Undefined";
            PlayState[PlayState["Stopped"] = 1] = "Stopped";
            PlayState[PlayState["Paused"] = 2] = "Paused";
            PlayState[PlayState["Playing"] = 3] = "Playing";
            PlayState[PlayState["ScanningForward"] = 4] = "ScanningForward";
            PlayState[PlayState["ScanningBackward"] = 5] = "ScanningBackward";
            PlayState[PlayState["Buffering"] = 6] = "Buffering";
            PlayState[PlayState["Idle"] = 7] = "Idle";
            PlayState[PlayState["MediaEnded"] = 8] = "MediaEnded";
            PlayState[PlayState["Transitioning"] = 9] = "Transitioning";
            PlayState[PlayState["Ready"] = 10] = "Ready";
            PlayState[PlayState["Reconnecting"] = 11] = "Reconnecting";
            PlayState[PlayState["Last"] = 12] = "Last";
        })(PlayState = Constants.PlayState || (Constants.PlayState = {}));
        var RepeatMode;
        (function (RepeatMode) {
            RepeatMode[RepeatMode["Off"] = 0] = "Off";
            RepeatMode[RepeatMode["Song"] = 1] = "Song";
            RepeatMode[RepeatMode["Shuffle"] = 2] = "Shuffle";
        })(RepeatMode = Constants.RepeatMode || (Constants.RepeatMode = {}));
        var MessageType;
        (function (MessageType) {
            MessageType[MessageType["MediaStateMessage"] = 0] = "MediaStateMessage";
            MessageType[MessageType["ProgressTimer"] = 1] = "ProgressTimer";
            MessageType[MessageType["TrackDetails"] = 2] = "TrackDetails";
        })(MessageType = Constants.MessageType || (Constants.MessageType = {}));
        var PlayViewType;
        (function (PlayViewType) {
            PlayViewType[PlayViewType["Playlist"] = 0] = "Playlist";
            PlayViewType[PlayViewType["CurrentlyPlaying"] = 1] = "CurrentlyPlaying";
        })(PlayViewType = Constants.PlayViewType || (Constants.PlayViewType = {}));
    })(Constants = musicApp.Constants || (musicApp.Constants = {}));
})(musicApp || (musicApp = {}));
//# sourceMappingURL=Constants.js.map
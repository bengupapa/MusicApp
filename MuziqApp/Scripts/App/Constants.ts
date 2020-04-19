module musicApp.Constants {
    export enum PlayState {
        Undefined = 0,
        Stopped = 1,
        Paused = 2,
        Playing = 3,
        ScanningForward = 4,
        ScanningBackward = 5,
        Buffering = 6,
        Idle = 7,
        MediaEnded = 8,
        Transitioning = 9,
        Ready = 10,
        Reconnecting = 11,
        Last = 12
    }

    export enum RepeatMode {
        Off = 0,
        Song = 1,
        Shuffle = 2
    }

    export enum MessageType {
        MediaStateMessage = 0,
        ProgressTimer = 1,
        TrackDetails = 2
    }

    export enum PlayViewType {
        Playlist = 0,
        CurrentlyPlaying = 1
    }
}
/// <reference path="../typings/jquery/jquery.d.ts" />

module musicApp.Controllers {
    export class MusicController {
        constructor(facadeController: Controllers.FacadeController) {
            this.facadeCtrl = facadeController;
            console.log("Music cntrl created");
        };

        private static musicController: MusicController = null;
        private facadeCtrl: Controllers.FacadeController;

        public getAlbums(artistID: string){

            $.ajax({
                url: "/Music/GetAlbums",
                type: "GET",
                data: { artistId: artistID },
                success: (data) => {
                    this.facadeCtrl.updateAlbumsPanel(data);
                }
            });
        };

        public playSong(songID: string) {

            $.ajax({
                url: "/Music/PlaySong",
                type: "GET",
                data: { songId: songID },
                success: (data) => {
                    this.facadeCtrl.updatePlayButtonSate(<Constants.PlayState>(data.State));
                }
            });
        }

        public stopSong() {

            $.ajax({
                url: "/Music/StopSong",
                type: "POST",
                success: (data: any) => {
                    let playType: Constants.PlayViewType = this.facadeCtrl.getCurrentViewType();
                    if (playType == Constants.PlayViewType.Playlist) {
                        this.getPlayView(musicApp.Constants.PlayViewType.Playlist);
                    }
                }
            });
        }

        public adjustVolume(volume: number) {
            var buffer: number = 4;
            $.ajax({
                url: "/Music/AdjustVolume",
                data: { vol: volume + buffer },
                type: "POST",
                success: (data) => {
                    this.facadeCtrl.updateVolumeProgBar(volume);
                }
            });
        }

        public muteSound(muteSate: boolean) {

            $.ajax({
                url: "/Music/MuteSound",
                data: { mute: muteSate },
                type: "POST",
                success: (data) => {
                    this.facadeCtrl.updateVolumeLabel(muteSate);
                }
            });
        }

        public static getMediaState() {
            var facadeCtrl = FacadeController.Instance();

            $.ajax({
                url: "/Music/GetMediaState",
                type: "GET",
                success: (data: Models.MediaState) => {
                    if (data) {
                        var musicCtrl = Controllers.MusicController.Instance(facadeCtrl);
                        musicCtrl.getAlbums(data.ArtistId);
                        facadeCtrl.refreshMediaState(data);
                    } else {
                        facadeCtrl.selectFirstAlbum();
                    }
                }
            });
        }

        public static getCurrentlyPlayingTrackView(mediaState: Models.MediaState) {
            $.ajax({
                url: "/Music/GetCurrentlyPlayingTrackView",
                data: mediaState,
                type: "GET",
                success: (data: any) => {
                    var facadeCtrl = FacadeController.Instance();
                    facadeCtrl.updateCurrentlyPlayingView(data);
                }
            });
        }

        public getSongState() {
            $.ajax({
                url: "/Music/GetSongState",
                type: "GET",
                success: (data: Models.MediaStateMessage) => {
                    this.facadeCtrl.updateStateLabel(data);
                }
            });
        }

        public setRepeatMode(repeatMode: Constants.RepeatMode) {

            $.ajax({
                url: "/Music/SetRepeatMode",
                data: { mode: repeatMode },
                type: "POST",
                success: (data) => {
                    this.facadeCtrl.updateRepeatLabel(repeatMode);
                }
            });
        }

        public adjustProgess(pos: number) {
            
            $.ajax({
                url: "/Music/AdjustProgress",
                data: { position: pos},
                type: "GET",
                success: (data: number) => {
                    this.facadeCtrl.updateProgressBar(data);
                }
            });
        }

        public getPlayView(viewType: Constants.PlayViewType) {
            switch (viewType) {
                case Constants.PlayViewType.CurrentlyPlaying:
                    this.getCurrentPlaying(); break;
                case Constants.PlayViewType.Playlist:
                    this.getPlaylist(); break;
            }
        }

        private getPlaylist() {
            $.ajax({
                url: "/Music/GetPlaylist",
                type: "GET",
                success: (data: any) => {
                    this.facadeCtrl.updateCurrentlyPlayingView(data);
                },
                complete: (data) => {
                    this.updatePlaylistMediaState();
                }
            });
        }

        private updatePlaylistMediaState(): JQueryXHR {
            return $.ajax({
                url: "/Music/UpdatePlaylistMediaState",
                type: "GET"
            });
        }

        private getCurrentPlaying() {
            $.ajax({
                url: "/Music/GetCurrentlyPlayingView",
                type: "GET",
                success: (data: any) => {
                    this.facadeCtrl.updateCurrentlyPlayingView(data);
                }
            });
        }

        public clearPlaylist() {
            $.ajax({
                url: "/Music/ClearPlaylist",
                type: "GET",
                success: (data: any) => {
                    this.facadeCtrl.updateCurrentlyPlayingView(data);
                    this.facadeCtrl.updatePlayViewButton(musicApp.Constants.PlayViewType.CurrentlyPlaying);
                }
            });
        }

        public addToPlaylist(aSongId) {
            $.ajax({
                url: "/Music/AddToPlaylist",
                type: "GET",
                data: { songId: aSongId },
                success: (data: any) => {
                    this.getPlayView(musicApp.Constants.PlayViewType.Playlist);
                    this.facadeCtrl.updatePlayViewButton(musicApp.Constants.PlayViewType.Playlist);
                }
            });
        }

        public removeFromPlaylist(aSongId) {
            $.ajax({
                url: "/Music/RemoveFromPlaylist",
                type: "GET",
                data: { songId: aSongId },
                success: (data: any) => {
                    this.getPlayView(musicApp.Constants.PlayViewType.Playlist);
                    this.facadeCtrl.updatePlayViewButton(musicApp.Constants.PlayViewType.Playlist);
                }
            });
        }

        public playNextTrack() {
            $.ajax({
                url: "/Music/PlayNextTrack",
                type: "GET",
                success: (data: any) => { }
            });
        }

        public playPrevTrack() {
            $.ajax({
                url: "/Music/PlayPrevTrack",
                type: "GET",
                success: (data: any) => { }
            });
        }

        public playAllTracks(albumId): JQueryXHR {
            return $.ajax({
                url: "/Music/PlayAllTrackOfAlbum",
                data: { albumId: albumId },
                type: "GET"
            });
        }

        public addAllTracks(albumId): JQueryXHR {
            return $.ajax({
                url: "/Music/AddAllTrackOfAlbum",
                data: { albumId: albumId },
                type: "GET"
            });
        }

        public static retriveAlbumTracks(albumId: string) {
            let facadeCtrl = FacadeController.Instance();
            let musicCtrl = MusicController.Instance(facadeCtrl);

            musicCtrl.updatePlaylistMediaState().done(() => facadeCtrl.expandSongs(albumId));
        }

        public static Instance(facadeCntrl: FacadeController): MusicController {
            return this.musicController != null ? this.musicController : (this.musicController = new MusicController(facadeCntrl))
        }
    }
}
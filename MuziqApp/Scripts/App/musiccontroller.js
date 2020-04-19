/// <reference path="../typings/jquery/jquery.d.ts" />
var musicApp;
(function (musicApp) {
    var Controllers;
    (function (Controllers) {
        var MusicController = /** @class */ (function () {
            function MusicController(facadeController) {
                this.facadeCtrl = facadeController;
                console.log("Music cntrl created");
            }
            ;
            MusicController.prototype.getAlbums = function (artistID) {
                var _this = this;
                $.ajax({
                    url: "/Music/GetAlbums",
                    type: "GET",
                    data: { artistId: artistID },
                    success: function (data) {
                        _this.facadeCtrl.updateAlbumsPanel(data);
                    }
                });
            };
            ;
            MusicController.prototype.playSong = function (songID) {
                var _this = this;
                $.ajax({
                    url: "/Music/PlaySong",
                    type: "GET",
                    data: { songId: songID },
                    success: function (data) {
                        _this.facadeCtrl.updatePlayButtonSate((data.State));
                    }
                });
            };
            MusicController.prototype.stopSong = function () {
                var _this = this;
                $.ajax({
                    url: "/Music/StopSong",
                    type: "POST",
                    success: function (data) {
                        var playType = _this.facadeCtrl.getCurrentViewType();
                        if (playType == musicApp.Constants.PlayViewType.Playlist) {
                            _this.getPlayView(musicApp.Constants.PlayViewType.Playlist);
                        }
                    }
                });
            };
            MusicController.prototype.adjustVolume = function (volume) {
                var _this = this;
                var buffer = 4;
                $.ajax({
                    url: "/Music/AdjustVolume",
                    data: { vol: volume + buffer },
                    type: "POST",
                    success: function (data) {
                        _this.facadeCtrl.updateVolumeProgBar(volume);
                    }
                });
            };
            MusicController.prototype.muteSound = function (muteSate) {
                var _this = this;
                $.ajax({
                    url: "/Music/MuteSound",
                    data: { mute: muteSate },
                    type: "POST",
                    success: function (data) {
                        _this.facadeCtrl.updateVolumeLabel(muteSate);
                    }
                });
            };
            MusicController.getMediaState = function () {
                var facadeCtrl = Controllers.FacadeController.Instance();
                $.ajax({
                    url: "/Music/GetMediaState",
                    type: "GET",
                    success: function (data) {
                        if (data) {
                            var musicCtrl = Controllers.MusicController.Instance(facadeCtrl);
                            musicCtrl.getAlbums(data.ArtistId);
                            facadeCtrl.refreshMediaState(data);
                        }
                        else {
                            facadeCtrl.selectFirstAlbum();
                        }
                    }
                });
            };
            MusicController.getCurrentlyPlayingTrackView = function (mediaState) {
                $.ajax({
                    url: "/Music/GetCurrentlyPlayingTrackView",
                    data: mediaState,
                    type: "GET",
                    success: function (data) {
                        var facadeCtrl = Controllers.FacadeController.Instance();
                        facadeCtrl.updateCurrentlyPlayingView(data);
                    }
                });
            };
            MusicController.prototype.getSongState = function () {
                var _this = this;
                $.ajax({
                    url: "/Music/GetSongState",
                    type: "GET",
                    success: function (data) {
                        _this.facadeCtrl.updateStateLabel(data);
                    }
                });
            };
            MusicController.prototype.setRepeatMode = function (repeatMode) {
                var _this = this;
                $.ajax({
                    url: "/Music/SetRepeatMode",
                    data: { mode: repeatMode },
                    type: "POST",
                    success: function (data) {
                        _this.facadeCtrl.updateRepeatLabel(repeatMode);
                    }
                });
            };
            MusicController.prototype.adjustProgess = function (pos) {
                var _this = this;
                $.ajax({
                    url: "/Music/AdjustProgress",
                    data: { position: pos },
                    type: "GET",
                    success: function (data) {
                        _this.facadeCtrl.updateProgressBar(data);
                    }
                });
            };
            MusicController.prototype.getPlayView = function (viewType) {
                switch (viewType) {
                    case musicApp.Constants.PlayViewType.CurrentlyPlaying:
                        this.getCurrentPlaying();
                        break;
                    case musicApp.Constants.PlayViewType.Playlist:
                        this.getPlaylist();
                        break;
                }
            };
            MusicController.prototype.getPlaylist = function () {
                var _this = this;
                $.ajax({
                    url: "/Music/GetPlaylist",
                    type: "GET",
                    success: function (data) {
                        _this.facadeCtrl.updateCurrentlyPlayingView(data);
                    },
                    complete: function (data) {
                        _this.updatePlaylistMediaState();
                    }
                });
            };
            MusicController.prototype.updatePlaylistMediaState = function () {
                return $.ajax({
                    url: "/Music/UpdatePlaylistMediaState",
                    type: "GET"
                });
            };
            MusicController.prototype.getCurrentPlaying = function () {
                var _this = this;
                $.ajax({
                    url: "/Music/GetCurrentlyPlayingView",
                    type: "GET",
                    success: function (data) {
                        _this.facadeCtrl.updateCurrentlyPlayingView(data);
                    }
                });
            };
            MusicController.prototype.clearPlaylist = function () {
                var _this = this;
                $.ajax({
                    url: "/Music/ClearPlaylist",
                    type: "GET",
                    success: function (data) {
                        _this.facadeCtrl.updateCurrentlyPlayingView(data);
                        _this.facadeCtrl.updatePlayViewButton(musicApp.Constants.PlayViewType.CurrentlyPlaying);
                    }
                });
            };
            MusicController.prototype.addToPlaylist = function (aSongId) {
                var _this = this;
                $.ajax({
                    url: "/Music/AddToPlaylist",
                    type: "GET",
                    data: { songId: aSongId },
                    success: function (data) {
                        _this.getPlayView(musicApp.Constants.PlayViewType.Playlist);
                        _this.facadeCtrl.updatePlayViewButton(musicApp.Constants.PlayViewType.Playlist);
                    }
                });
            };
            MusicController.prototype.removeFromPlaylist = function (aSongId) {
                var _this = this;
                $.ajax({
                    url: "/Music/RemoveFromPlaylist",
                    type: "GET",
                    data: { songId: aSongId },
                    success: function (data) {
                        _this.getPlayView(musicApp.Constants.PlayViewType.Playlist);
                        _this.facadeCtrl.updatePlayViewButton(musicApp.Constants.PlayViewType.Playlist);
                    }
                });
            };
            MusicController.prototype.playNextTrack = function () {
                $.ajax({
                    url: "/Music/PlayNextTrack",
                    type: "GET",
                    success: function (data) { }
                });
            };
            MusicController.prototype.playPrevTrack = function () {
                $.ajax({
                    url: "/Music/PlayPrevTrack",
                    type: "GET",
                    success: function (data) { }
                });
            };
            MusicController.prototype.playAllTracks = function (albumId) {
                return $.ajax({
                    url: "/Music/PlayAllTrackOfAlbum",
                    data: { albumId: albumId },
                    type: "GET"
                });
            };
            MusicController.prototype.addAllTracks = function (albumId) {
                return $.ajax({
                    url: "/Music/AddAllTrackOfAlbum",
                    data: { albumId: albumId },
                    type: "GET"
                });
            };
            MusicController.retriveAlbumTracks = function (albumId) {
                var facadeCtrl = Controllers.FacadeController.Instance();
                var musicCtrl = MusicController.Instance(facadeCtrl);
                musicCtrl.updatePlaylistMediaState().done(function () { return facadeCtrl.expandSongs(albumId); });
            };
            MusicController.Instance = function (facadeCntrl) {
                return this.musicController != null ? this.musicController : (this.musicController = new MusicController(facadeCntrl));
            };
            MusicController.musicController = null;
            return MusicController;
        }());
        Controllers.MusicController = MusicController;
    })(Controllers = musicApp.Controllers || (musicApp.Controllers = {}));
})(musicApp || (musicApp = {}));
//# sourceMappingURL=musiccontroller.js.map
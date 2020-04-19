/// <reference path="musiccontroller.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
var musicApp;
(function (musicApp) {
    var EventHandler;
    (function (EventHandler) {
        $(function () {
            var facadeCtrl = musicApp.Controllers.FacadeController.Instance();
            var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtrl);
            //GET ARTIST ALBUMS
            $('.artist-wrapper').click(function () {
                var id = $(this).attr('data-id');
                musicCtrl.getAlbums(id);
            });
            //SET UP PLAY-PAUSE BUTTON
            $('#pause-song').hide();
            $('.play-button').click(function () {
                var songId = facadeCtrl.getCurrentSongId();
                musicCtrl.playSong(songId);
            });
            $('.stop-button').click(function () {
                musicCtrl.stopSong();
                facadeCtrl.updatePlayButtonSate(musicApp.Constants.PlayState.Stopped);
            });
            $('.outter-volume-bar').mousedown(function (e) {
                var volposition = e.pageX - $(this)[0].offsetLeft - 1175;
                musicCtrl.adjustVolume(volposition);
            });
            $('.outter-progress-bar').mousedown(function (e) {
                var position = e.pageX - $(this)[0].offsetLeft - 745;
                musicCtrl.adjustProgess(position);
            });
            $('.volume-control-label').click(function () {
                var mute = $(this).hasClass('vol-dummy');
                musicCtrl.muteSound(mute);
                $(this).toggleClass('vol-dummy');
            });
            $('.repeat-label').click(function () {
                var dataMode = $(this).find('.active').attr('data-mode');
                var repeatMode = (parseInt(dataMode));
                var mode;
                switch (repeatMode) {
                    case musicApp.Constants.RepeatMode.Off:
                        mode = musicApp.Constants.RepeatMode.Song;
                        break;
                    case musicApp.Constants.RepeatMode.Song:
                        mode = musicApp.Constants.RepeatMode.Shuffle;
                        break;
                    case musicApp.Constants.RepeatMode.Shuffle:
                        mode = musicApp.Constants.RepeatMode.Off;
                        break;
                    default:
                        mode = musicApp.Constants.RepeatMode.Off;
                        break;
                }
                musicCtrl.setRepeatMode(mode);
            });
            $('.play-view').click(function () {
                var playView = $(this).find('.active').attr('data-play-view');
                var playViewType = (parseInt(playView));
                var view;
                switch (playViewType) {
                    case musicApp.Constants.PlayViewType.Playlist:
                        view = musicApp.Constants.PlayViewType.CurrentlyPlaying;
                        break;
                    case musicApp.Constants.PlayViewType.CurrentlyPlaying:
                        view = musicApp.Constants.PlayViewType.Playlist;
                        break;
                    default:
                        view = musicApp.Constants.PlayViewType.CurrentlyPlaying;
                        break;
                }
                facadeCtrl.updatePlayViewButton(view);
                musicCtrl.getPlayView(view);
            });
            $('.prev-button').click(function () {
                musicCtrl.playPrevTrack();
            });
            $('.next-button').click(function () {
                musicCtrl.playNextTrack();
            });
        });
    })(EventHandler = musicApp.EventHandler || (musicApp.EventHandler = {}));
})(musicApp || (musicApp = {}));
;
function expandSongs(albumId) {
    musicApp.Controllers.MusicController.retriveAlbumTracks(albumId);
}
;
function selectSong(songId, artistName, albumName, songName, artistId, albumId) {
    var facadeCtr = musicApp.Controllers.FacadeController.Instance();
    var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    var track = new musicApp.Models.MediaState();
    track.SongId = songId;
    track.SongName = songName;
    track.AlbumId = albumId;
    track.AlbumName = albumName;
    track.ArtistId = artistId;
    track.ArtistName = artistName;
    musicCtrl.playSong(songId);
    facadeCtr.highlightSong(track);
    musicApp.Controllers.MusicController.getCurrentlyPlayingTrackView(track);
    facadeCtr.updatePlayViewButton(musicApp.Constants.PlayViewType.CurrentlyPlaying);
}
;
function clearPlaylist() {
    var facadeCtr = musicApp.Controllers.FacadeController.Instance();
    var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    musicCtrl.clearPlaylist();
}
;
function addToPlaylist(songId) {
    var facadeCtr = musicApp.Controllers.FacadeController.Instance();
    var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    musicCtrl.addToPlaylist(songId);
}
;
function removeFromPlaylist(songId) {
    var facadeCtr = musicApp.Controllers.FacadeController.Instance();
    var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    musicCtrl.removeFromPlaylist(songId);
}
;
function playSong(songId) {
    var facadeCtr = musicApp.Controllers.FacadeController.Instance();
    var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    musicCtrl.playSong(songId);
    facadeCtr.storeAndHighlightSelectedSong(songId);
}
;
function playAll(albumId) {
    var facadeCtr = musicApp.Controllers.FacadeController.Instance();
    var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    musicCtrl.playAllTracks(albumId).done(function () { return musicCtrl.getPlayView(musicApp.Constants.PlayViewType.Playlist); });
}
function addAll(albumId) {
    var facadeCtr = musicApp.Controllers.FacadeController.Instance();
    var musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    musicCtrl.addAllTracks(albumId).done(function () { return musicCtrl.getPlayView(musicApp.Constants.PlayViewType.Playlist); });
}
//# sourceMappingURL=EventHandlerRegistory.js.map
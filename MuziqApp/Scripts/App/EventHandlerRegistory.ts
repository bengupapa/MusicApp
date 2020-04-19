/// <reference path="musiccontroller.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />

module musicApp.EventHandler {
    $(function () {

        let facadeCtrl = Controllers.FacadeController.Instance();
        let musicCtrl = Controllers.MusicController.Instance(facadeCtrl);       

        //GET ARTIST ALBUMS
        $('.artist-wrapper').click(function () {
            let id = $(this).attr('data-id');
            musicCtrl.getAlbums(id);
        });

        //SET UP PLAY-PAUSE BUTTON
        $('#pause-song').hide();
        $('.play-button').click(function () {
            let songId = facadeCtrl.getCurrentSongId();
            musicCtrl.playSong(songId);
        });

        $('.stop-button').click(() => {
            musicCtrl.stopSong();
            facadeCtrl.updatePlayButtonSate(Constants.PlayState.Stopped);
        });

        $('.outter-volume-bar').mousedown(function (e) {
            let volposition: number = e.pageX - $(this)[0].offsetLeft - 1175;
            musicCtrl.adjustVolume(volposition);
        });

        $('.outter-progress-bar').mousedown(function (e) {
            let position: number = e.pageX - $(this)[0].offsetLeft - 745;
            musicCtrl.adjustProgess(position);
        });

        $('.volume-control-label').click(function () {
            let mute: boolean = $(this).hasClass('vol-dummy');
            musicCtrl.muteSound(mute);
            $(this).toggleClass('vol-dummy');
        });

        $('.repeat-label').click(function () {

            const dataMode: string = $(this).find('.active').attr('data-mode');
            const repeatMode: Constants.RepeatMode = <Constants.RepeatMode>(parseInt(dataMode));
            let mode: Constants.RepeatMode;

            switch (repeatMode) {
                case Constants.RepeatMode.Off:
                    mode = Constants.RepeatMode.Song; break;
                case Constants.RepeatMode.Song:
                    mode = Constants.RepeatMode.Shuffle; break;
                case Constants.RepeatMode.Shuffle:
                    mode = Constants.RepeatMode.Off; break;
                default:
                    mode = Constants.RepeatMode.Off; break;
            }

            musicCtrl.setRepeatMode(mode);
        }); 

        $('.play-view').click(function () {
            const playView: string = $(this).find('.active').attr('data-play-view');
            const playViewType: Constants.PlayViewType = <Constants.PlayViewType>(parseInt(playView));
            let view: Constants.PlayViewType;

            switch (playViewType) {
                case Constants.PlayViewType.Playlist:
                    view = Constants.PlayViewType.CurrentlyPlaying; break;
                case Constants.PlayViewType.CurrentlyPlaying:
                    view = Constants.PlayViewType.Playlist; break;
                default:
                    view = Constants.PlayViewType.CurrentlyPlaying; break;
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
};

function expandSongs(albumId) {
    musicApp.Controllers.MusicController.retriveAlbumTracks(albumId);
};

function selectSong(songId, artistName, albumName, songName, artistId, albumId) {
    let facadeCtr = musicApp.Controllers.FacadeController.Instance();
    let musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    let track = new musicApp.Models.MediaState();

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
};

function clearPlaylist() {
    let facadeCtr = musicApp.Controllers.FacadeController.Instance();
    let musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);

    musicCtrl.clearPlaylist();
};

function addToPlaylist(songId) {

    let facadeCtr = musicApp.Controllers.FacadeController.Instance();
    let musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);

    musicCtrl.addToPlaylist(songId);
};

function removeFromPlaylist(songId) {
    let facadeCtr = musicApp.Controllers.FacadeController.Instance();
    let musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);

    musicCtrl.removeFromPlaylist(songId);
};

function playSong(songId) {
    let facadeCtr = musicApp.Controllers.FacadeController.Instance();
    let musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    musicCtrl.playSong(songId);
    facadeCtr.storeAndHighlightSelectedSong(songId);
};

function playAll(albumId) {
    let facadeCtr = musicApp.Controllers.FacadeController.Instance();
    let musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);
    
    musicCtrl.playAllTracks(albumId).done(() => musicCtrl.getPlayView(musicApp.Constants.PlayViewType.Playlist));
}

function addAll(albumId) {
    let facadeCtr = musicApp.Controllers.FacadeController.Instance();
    let musicCtrl = musicApp.Controllers.MusicController.Instance(facadeCtr);

    musicCtrl.addAllTracks(albumId).done(() => musicCtrl.getPlayView(musicApp.Constants.PlayViewType.Playlist));
}
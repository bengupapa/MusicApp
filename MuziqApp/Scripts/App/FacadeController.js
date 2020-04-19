var musicApp;
(function (musicApp) {
    var Controllers;
    (function (Controllers) {
        var FacadeController = /** @class */ (function () {
            function FacadeController() {
                console.log("facade controller created");
            }
            ;
            FacadeController.prototype.updateAlbumsPanel = function (data) {
                $('#albums_wrapper').empty();
                $('#albums_wrapper').html(data);
                this.hightlightSongDetails();
            };
            ;
            FacadeController.prototype.expandSongs = function (albumId) {
                $('#songs_of_' + albumId).slideToggle();
            };
            ;
            FacadeController.prototype.highlightSong = function (track) {
                this.storeAndHighlightSelectedArtist(track.ArtistId);
                this.storeAndHightSelectedAlbum(track.AlbumId);
                this.storeAndHighlightSelectedSong(track.SongId);
            };
            ;
            FacadeController.prototype.updateCurrentlyPlayingView = function (data) {
                $('.media-info-wrapper').empty().html(data);
            };
            FacadeController.prototype.storeAndHighlightSelectedSong = function (songId) {
                $('#current-selected-song').empty().html(songId);
            };
            FacadeController.prototype.storeAndHightSelectedAlbum = function (albumId) {
                $('.album-details')
                    .removeClass('album-details-custom')
                    .addClass('album-details-default');
                $('#album_details_' + albumId).addClass('album-details-custom');
                $('#current-selected-album').empty().html(albumId);
            };
            FacadeController.prototype.storeAndHighlightSelectedArtist = function (artistId) {
                $('.artist-wrapper')
                    .removeClass('artist-wrapper-custom')
                    .addClass('artist-wrapper-default');
                $('#artist_wrapper_' + artistId).addClass('artist-wrapper-custom');
                $('.artist-album-count')
                    .removeClass('artist-album-count-custom')
                    .addClass('artist-album-count-default');
                $('#artist_album_count_' + artistId).addClass('artist-album-count-custom');
                $('#current-selected-artist').empty().html(artistId);
            };
            FacadeController.prototype.hightlightSongDetails = function () {
                if (!$('#current-selected-artist').is(':empty')) {
                    var artistId = $('#current-selected-artist').html();
                    this.storeAndHighlightSelectedArtist(artistId);
                }
                if (!$('#current-selected-album').is(':empty')) {
                    var albumId = $('#current-selected-album').html();
                    this.storeAndHightSelectedAlbum(albumId);
                }
                if (!$('#current-selected-song').is(':empty')) {
                    var songId = $('#current-selected-song').html();
                    this.storeAndHighlightSelectedSong(songId);
                }
            };
            FacadeController.prototype.getCurrentSongId = function () {
                if ($('#current-selected-song').is(':empty')) {
                    $('.album-songs-wrapper')
                        .first()
                        .children('.song-row')
                        .first()
                        .children('.song-row-data')
                        .click();
                    return $('#current-selected-song').html();
                }
                else {
                    return $('#current-selected-song').html();
                }
            };
            FacadeController.prototype.updateStateLabel = function (msg) {
                $('.song-state').empty();
                $('#cur-song-state_' + msg.SongId).html(musicApp.Constants.PlayState[msg.State]);
                $('.album-song-state').html(musicApp.Constants.PlayState[msg.State]);
                $('.playlist-song-state').empty();
                $('#playlist_song_state_' + msg.SongId).html(musicApp.Constants.PlayState[msg.State]);
                $('.remove-playlist-button').show();
                $('#remove_playlist_button_' + msg.SongId).hide();
            };
            FacadeController.prototype.updateVolumeProgBar = function (volposition) {
                var vol = volposition + 4;
                $('.inner-volume-bar').css('width', volposition);
                if (vol > 9) {
                    $('.inner-volume-bar').html(vol.toString());
                }
                else {
                    $('.inner-volume-bar').empty();
                }
            };
            FacadeController.prototype.updateVolumeLabel = function (muteState) {
                if (muteState) {
                    $('.volume-control-label').css('color', 'teal');
                    $('.inner-volume-bar').css('background-color', 'teal');
                }
                else {
                    $('.volume-control-label').css('color', 'burlywood');
                    $('.inner-volume-bar').css('background-color', 'crimson');
                }
            };
            FacadeController.prototype.updatePlayButtonSate = function (playState) {
                if (playState == musicApp.Constants.PlayState.Playing) {
                    $('.play-button')
                        .removeClass('play-button-play')
                        .addClass('play-button-pause');
                    $('.play-button')
                        .removeClass('play-button-custom')
                        .addClass('play-button-default');
                    $('.outter-progress-bar')
                        .removeClass('play-button-custom')
                        .addClass('play-button-default');
                    $('#pause-song').show();
                    $('#play-song').hide();
                }
                else if (playState == musicApp.Constants.PlayState.Paused) {
                    $('.play-button')
                        .removeClass('play-button-pause')
                        .addClass('play-button-play');
                    $('.play-button')
                        .removeClass('play-button-default')
                        .addClass('play-button-custom');
                    $('.outter-progress-bar')
                        .removeClass('play-button-default')
                        .addClass('play-button-custom');
                    $('#pause-song').hide();
                    $('#play-song').show();
                }
                else /*if (playState == Constants.PlayState.Stopped)*/ {
                    $('.play-button')
                        .removeClass('play-button-pause')
                        .addClass('play-button-play');
                    $('.play-button')
                        .removeClass('play-button-custom')
                        .addClass('play-button-default');
                    $('.outter-progress-bar')
                        .removeClass('play-button-custom')
                        .addClass('play-button-default');
                    $('#pause-song').hide();
                    $('#play-song').show();
                }
            };
            FacadeController.prototype.refreshMediaState = function (track) {
                var msg = new musicApp.Models.MediaStateMessage();
                msg.SongId = track.SongId;
                msg.State = track.State;
                this.updatePlayButtonSate(track.State);
                this.highlightSong(track);
                Controllers.MusicController.getCurrentlyPlayingTrackView(track);
                this.updateStateLabel(msg);
                this.updateVolumeProgBar(track.Volume);
                this.updateRepeatLabel(track.Mode);
                this.updateProgressBarPosition(track.TrackTimespan);
            };
            FacadeController.prototype.updateRepeatLabel = function (mode) {
                $('.repeat-state').removeClass('active');
                $('b[data-mode="' + mode + '"]').addClass('active');
                if (mode === musicApp.Constants.RepeatMode.Shuffle || mode === musicApp.Constants.RepeatMode.Song) {
                    $('.repeat-label').addClass('text-high-light');
                }
                else {
                    $('.repeat-label').removeClass('text-high-light');
                }
            };
            FacadeController.prototype.updatePlayViewButton = function (playView) {
                $('.play-view-type').removeClass('active');
                $('span[data-play-view="' + playView + '"]').addClass('active');
            };
            FacadeController.prototype.selectFirstAlbum = function () {
                $('.artist-wrapper').first().click();
            };
            FacadeController.prototype.updateProgressBar = function (position) {
                $('.inner-progress-bar').css('width', position);
                if (position > 9) {
                    position = position / 100;
                    var pos = position.toString().replace('.', ':');
                    $('.inner-progress-bar').html(pos);
                    $('.progress-timer').html(pos);
                }
                else {
                    $('.inner-progress-bar').empty();
                }
            };
            FacadeController.prototype.updateProgressBarPosition = function (timeSpan) {
                var pos = (timeSpan.CurrentPosition * 350) / timeSpan.Duration;
                var time = this.getFormattedTime(timeSpan);
                $('.inner-progress-bar').css('width', parseInt(pos.toString()));
                $('.inner-progress-bar').html(time);
                $('.progress-timer').html(time);
            };
            FacadeController.prototype.getFormattedTime = function (timeSpan) {
                var pos = (timeSpan.CurrentPosition * 350) / timeSpan.Duration;
                var minutes = parseInt((timeSpan.CurrentPosition / 60).toString());
                var seconds = parseInt((((timeSpan.CurrentPosition / 60) - minutes) * 60).toString());
                var nuSeconds = seconds.toString().length < 2 ? '0' + seconds : seconds;
                var time = minutes + ':' + nuSeconds;
                return time;
            };
            FacadeController.prototype.getCurrentViewType = function () {
                var playTypeVal = $('.play-view').find('span[class="play-view-type active"]').attr('data-play-view');
                var playTypeInt = parseInt(playTypeVal);
                var playType = (playTypeInt);
                return playType;
            };
            FacadeController.Instance = function () {
                return this.facadeController != null ? this.facadeController : (this.facadeController = new Controllers.FacadeController());
            };
            FacadeController.handleSignals = function (message) {
                var facadeCtrl = this.Instance();
                musicApp.Core.MessageHandlerRegistry
                    .handler(message.MessageType)
                    .processMessage(facadeCtrl, message);
            };
            FacadeController.facadeController = null;
            return FacadeController;
        }());
        Controllers.FacadeController = FacadeController;
    })(Controllers = musicApp.Controllers || (musicApp.Controllers = {}));
})(musicApp || (musicApp = {}));
//# sourceMappingURL=FacadeController.js.map
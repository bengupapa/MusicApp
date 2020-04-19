module musicApp.Controllers {
    export class FacadeController {
        constructor() {
            console.log("facade controller created");
        };

        private static facadeController: FacadeController = null;

        public updateAlbumsPanel(data: any) {
            $('#albums_wrapper').empty();
            $('#albums_wrapper').html(data);

            this.hightlightSongDetails();
        };

        public expandSongs(albumId: string) {
            $('#songs_of_' + albumId).slideToggle();
        };

        public highlightSong(track: Models.MediaState) {

            this.storeAndHighlightSelectedArtist(track.ArtistId);
            this.storeAndHightSelectedAlbum(track.AlbumId);
            this.storeAndHighlightSelectedSong(track.SongId);
        };

        public updateCurrentlyPlayingView(data: any) {
            $('.media-info-wrapper').empty().html(data);
        }

        public storeAndHighlightSelectedSong(songId: string) {
            $('#current-selected-song').empty().html(songId);
            
        }

        public storeAndHightSelectedAlbum(albumId: string) {
            $('.album-details')
                .removeClass('album-details-custom')
                .addClass('album-details-default');
            $('#album_details_' + albumId).addClass('album-details-custom');

            $('#current-selected-album').empty().html(albumId);
        }

        public storeAndHighlightSelectedArtist(artistId: string) {
            $('.artist-wrapper')
                .removeClass('artist-wrapper-custom')
                .addClass('artist-wrapper-default');
            $('#artist_wrapper_' + artistId).addClass('artist-wrapper-custom');

            $('.artist-album-count')
                .removeClass('artist-album-count-custom')
                .addClass('artist-album-count-default');
            $('#artist_album_count_' + artistId).addClass('artist-album-count-custom');

            $('#current-selected-artist').empty().html(artistId);
        }

        private hightlightSongDetails() {
            if (!$('#current-selected-artist').is(':empty')) {
                let artistId = $('#current-selected-artist').html();
                this.storeAndHighlightSelectedArtist(artistId);
            }

            if (!$('#current-selected-album').is(':empty')) {
                let albumId = $('#current-selected-album').html();
                this.storeAndHightSelectedAlbum(albumId);
            }

            if (!$('#current-selected-song').is(':empty')) {
                let songId = $('#current-selected-song').html();
                this.storeAndHighlightSelectedSong(songId);
            }
        }

        public getCurrentSongId(): string {
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
        }

        public updateStateLabel(msg: Models.MediaStateMessage) {
            $('.song-state').empty();
            $('#cur-song-state_' + msg.SongId).html(Constants.PlayState[msg.State]);
            $('.album-song-state').html(Constants.PlayState[msg.State]);

            $('.playlist-song-state').empty();
            $('#playlist_song_state_' + msg.SongId).html(Constants.PlayState[msg.State]);

            $('.remove-playlist-button').show();
            $('#remove_playlist_button_' + msg.SongId).hide();
        }

        public updateVolumeProgBar(volposition: number) {
            let vol: number = volposition + 4;
            $('.inner-volume-bar').css('width', volposition);

            if (vol > 9) {
                $('.inner-volume-bar').html(vol.toString());
            } else {
                $('.inner-volume-bar').empty();
            }
        }

        public updateVolumeLabel(muteState: boolean) {
            if (muteState) {
                $('.volume-control-label').css('color', 'teal');
                $('.inner-volume-bar').css('background-color', 'teal');
            }
            else {
                $('.volume-control-label').css('color', 'burlywood');
                $('.inner-volume-bar').css('background-color', 'crimson');
            }
        }

        public updatePlayButtonSate(playState: Constants.PlayState) {
            if (playState == Constants.PlayState.Playing) {
                $('.play-button')
                    .removeClass('play-button-play')
                    .addClass('play-button-pause');

                $('.play-button')
                    .removeClass('play-button-custom')
                    .addClass('play-button-default')

                $('.outter-progress-bar')
                    .removeClass('play-button-custom')
                    .addClass('play-button-default');

                $('#pause-song').show();
                $('#play-song').hide();
            }
            else if (playState == Constants.PlayState.Paused) {
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
                $('#play-song').show()
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
        }

        public refreshMediaState(track: Models.MediaState) {
            let msg = new Models.MediaStateMessage();
            msg.SongId = track.SongId;
            msg.State = track.State;

            this.updatePlayButtonSate(track.State);
            this.highlightSong(track);
            Controllers.MusicController.getCurrentlyPlayingTrackView(track);
            this.updateStateLabel(msg);
            this.updateVolumeProgBar(track.Volume);
            this.updateRepeatLabel(track.Mode);
            this.updateProgressBarPosition(track.TrackTimespan);
        }

        public updateRepeatLabel(mode: Constants.RepeatMode) {
            $('.repeat-state').removeClass('active');
            $('b[data-mode="' + mode + '"]').addClass('active');

            if (mode === Constants.RepeatMode.Shuffle || mode === Constants.RepeatMode.Song) {
                $('.repeat-label').addClass('text-high-light');
            } else {
                $('.repeat-label').removeClass('text-high-light');
            }
        }

        public updatePlayViewButton(playView: Constants.PlayViewType) {
            $('.play-view-type').removeClass('active');
            $('span[data-play-view="' + playView + '"]').addClass('active');
        }

        public selectFirstAlbum() {
            $('.artist-wrapper').first().click();
        }

        public updateProgressBar(position: number) {
            $('.inner-progress-bar').css('width', position);

            if (position > 9) {
                position = position / 100;
                let pos = position.toString().replace('.', ':');

                $('.inner-progress-bar').html(pos);
                $('.progress-timer').html(pos);
            } else {
                $('.inner-progress-bar').empty();
            }
        }

        public updateProgressBarPosition(timeSpan: Models.TrackTimespan) {
            let pos = (timeSpan.CurrentPosition * 350) / timeSpan.Duration;
            let time = this.getFormattedTime(timeSpan);

            $('.inner-progress-bar').css('width', parseInt(pos.toString()));
            $('.inner-progress-bar').html(time);
            $('.progress-timer').html(time);
        }

        public getFormattedTime(timeSpan: Models.TrackTimespan): string {
            let pos = (timeSpan.CurrentPosition * 350) / timeSpan.Duration;
            let minutes = parseInt((timeSpan.CurrentPosition / 60).toString());
            let seconds = parseInt((((timeSpan.CurrentPosition / 60) - minutes) * 60).toString());
            let nuSeconds = seconds.toString().length < 2 ? '0' + seconds : seconds;
            let time = minutes + ':' + nuSeconds;

            return time;
        }

        public getCurrentViewType(): Constants.PlayViewType {
            let playTypeVal: any = $('.play-view').find('span[class="play-view-type active"]').attr('data-play-view');
            let playTypeInt: number = parseInt(playTypeVal);
            let playType: Constants.PlayViewType = <Constants.PlayViewType>(playTypeInt);
            return playType;
        }

        public static Instance(): FacadeController {
            return this.facadeController != null ? this.facadeController : (this.facadeController = new Controllers.FacadeController());
        }

        public static handleSignals(message: Models.Message) {
            let facadeCtrl = this.Instance();
            Core.MessageHandlerRegistry
                .handler(message.MessageType)
                .processMessage(facadeCtrl, message);
        }
    }
}
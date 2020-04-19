using MuziqApp.Constants;
using MuziqApp.Models;
using MuziqApp.SignalHubs;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using WMPLib;

namespace MuziqApp.Core
{
    public class MediaPlayer : IDisposable
    {
        private WindowsMediaPlayer _windowsMediaPlayer;
        private static MediaPlayer _mediaPlayer = null;
        private TimeManager _timeManager = null;
        private string _currentSongID = null;
        private PlaylistManager _playlist = null;

        private MediaPlayer()
        {
            _windowsMediaPlayer = new WindowsMediaPlayer();
            _playlist = new PlaylistManager(_windowsMediaPlayer);
            _timeManager = new TimeManager();

            _timeManager.Timer.Elapsed += (object sender, ElapsedEventArgs e) =>
            {
                SendTimespan(new TrackTimespan
                {
                    CurrentPosition = _windowsMediaPlayer.controls.currentPosition,
                    Duration = _windowsMediaPlayer.currentMedia.duration
                });
            };

            _windowsMediaPlayer.PlayStateChange += (int newSate) =>
            {
                SendMediaState(new MediaStateMessage
                {
                    SongId = this.CurrentMedia.Id,
                    State = (PlayState)newSate
                });
            };

            _windowsMediaPlayer.MediaChange += (object item) =>
            {
                IWMPMedia media = item as IWMPMedia;
                if(media != null)
                {
                    string songId = media.getItemInfo(Constants.Constants.TrackId);
                    this._currentSongID = songId;
                    
                    SendMediaState(new MediaStateMessage
                    {
                        SongId = songId,
                        State = (PlayState)(int)_windowsMediaPlayer.playState
                    });

                    Song song = _playlist.GetTrack(songId);
                    Album album = MusicProvider.Instance.GetAlbum(song.AlbumId);

                    SendTrackDetails(new MediaState
                    {
                        SongId = songId,
                        SongName = media.name,
                        AlbumId = album.Id,
                        AlbumName = album.Name,
                        ArtistId = album.ArtistId,
                        ArtistName = song.Airtist
                    });
                }
            };
        }

        public static MediaPlayer Instance
        {
            get
            {
                return _mediaPlayer ?? (_mediaPlayer = new MediaPlayer());
            }
        }

        public Song CurrentMedia
        {
            get
            {
                return this._playlist.GetTrack(this._currentSongID);
            }
        }

        public void Dispose()
        {
            _playlist.Dispose();
            _timeManager.Dispose();
            _mediaPlayer = null;
            _currentSongID = null;
            _windowsMediaPlayer = null;
        }

        public void FastForward()
        {
            _windowsMediaPlayer.controls.fastForward();
        }

        public void FastReverse()
        {
            _windowsMediaPlayer.controls.fastReverse();
        }

        public void Next()
        {
            _windowsMediaPlayer.controls.next();
        }

        public void Pause()
        {
            _timeManager.Stop();
            _windowsMediaPlayer.controls.pause();
        }

        public void AdjustVolume(int volume)
        {
            _windowsMediaPlayer.settings.volume = volume;
        }

        public void MuteSound(bool mute)
        {
            _windowsMediaPlayer.settings.mute = mute;
        }

        public PlayState Play(Song song)
        {
            if (this.CurrentMedia != null && song == this.CurrentMedia)
            {
                if (_windowsMediaPlayer.playState != WMPPlayState.wmppsPlaying)
                {
                    _windowsMediaPlayer.controls.play();
                    _timeManager.Start();
                    return PlayState.Playing;
                }
                else
                {
                    this.Pause();
                    return PlayState.Paused;
                }
            }
            else
            {
                _playlist.HandleIncomingTrack(song);

                this._currentSongID = song.Id;
                _windowsMediaPlayer.controls.playItem(song.MediaData);
                _timeManager.Start();
                return PlayState.Playing;
            }
        }

        internal double AdjustProgress(double position)
        {
            var duration = _windowsMediaPlayer.currentMedia.duration;
            var skipTo = position * duration / 350;
            _windowsMediaPlayer.controls.currentPosition = skipTo;

            return Math.Round(position, 2);
        }

        public void Previous()
        {
            _windowsMediaPlayer.controls.previous();
        }

        public void Stop()
        {
            _timeManager.Stop();
            _windowsMediaPlayer.controls.stop();
            SendTimespan(new TrackTimespan
            {
                CurrentPosition = default(double),
                Duration = 1
            });
        }

        public MediaStateMessage GetMediaState()
        {
            WMPPlayState state = _windowsMediaPlayer.playState;
            PlayState mediaState = (PlayState)(int)state;
            var stateMessage = new MediaStateMessage
            {
                State = mediaState,
                SongId = CurrentMedia?.Id,
                Volume = _windowsMediaPlayer.settings.volume
            };

            GetRepeatMode(stateMessage);
            GetTrackTimespan(stateMessage);

            return stateMessage;
        }

        private void GetTrackTimespan(MediaStateMessage stateMessage)
        {
            stateMessage.TrackTimespan = new TrackTimespan
            {
                Duration = _windowsMediaPlayer.currentMedia?.duration ?? default(double),
                CurrentPosition = _windowsMediaPlayer.controls.currentPosition
            };
        }

        private void GetRepeatMode(MediaStateMessage stateMessage)
        {
            bool shuffle = _windowsMediaPlayer.settings.getMode(Constants.Constants.Shuffle),
                song = _windowsMediaPlayer.settings.getMode(Constants.Constants.RepeatSong);

            if (shuffle)
                stateMessage.RepeatMode = RepeatMode.Shuffle;
            else if (song)
                stateMessage.RepeatMode = RepeatMode.Song;
            else
                stateMessage.RepeatMode = RepeatMode.Off;
        }

        public void Repeat(RepeatMode mode)
        {
            if (mode == RepeatMode.Off)
            {
                _windowsMediaPlayer.settings.setMode(Constants.Constants.RepeatSong, false);
                _windowsMediaPlayer.settings.setMode(Constants.Constants.Shuffle, false);
            }
            else if (mode == RepeatMode.Song)
            {
                _windowsMediaPlayer.settings.setMode(Constants.Constants.RepeatSong, true);
                _windowsMediaPlayer.settings.setMode(Constants.Constants.Shuffle, false);
            }
            else if (mode == RepeatMode.Shuffle)
            {
                _windowsMediaPlayer.settings.setMode(Constants.Constants.RepeatSong, false);
                _windowsMediaPlayer.settings.setMode(Constants.Constants.Shuffle, true);
            }
        }

        private void SendTimespan(TrackTimespan timeSpan)
        {
            SignalRConnection.Notify(new Message<TrackTimespan>(timeSpan, MessageType.ProgressTimer));
        }

        public void SendMediaState(MediaStateMessage message = null)
        {
            var mediaState = message ?? new MediaStateMessage
            {
                SongId = this.CurrentMedia?.Id,
                State = (PlayState)(int)_windowsMediaPlayer.playState
            };

            SignalRConnection.Notify(new Message<MediaStateMessage>(mediaState, MessageType.MediaStateMessage));
        }

        public void SendTrackDetails(MediaState mediaState)
        {
            SignalRConnection.Notify(new Message<MediaState>(mediaState, MessageType.TrackDetails));
        }

        public List<Song> GetPlaylist()
        {
            return _playlist.GetPlaylist();
        }

        public void AddTrack(Song song)
        {
            _playlist.AddTrack(song);
        }

        public void RemoveTrack(Song song)
        {
            _playlist.RemoveTrack(song);
        }

        public void ClearPlaylist()
        {
            _playlist.Clear(this._currentSongID);
        }

        public IWMPMedia GetMedia(string songPath)
        {
            return _windowsMediaPlayer.newMedia(songPath);
        }

        public void UpdateMediaState(MediaState mediaState)
        {
            mediaState.State = (PlayState)(int)_windowsMediaPlayer.playState;
        }

        public void PlayAllAlbumTracks(List<Song> tracks)
        {
            if(tracks != null && tracks.Any())
            {
                _playlist.Clear();
                _playlist.AddTracks(tracks);
                Play(tracks.First());
            }
        }

        public void AddAllAlbumTracks(List<Song> tracks)
        {
            if (tracks != null && tracks.Any())
            {
                _playlist.AddTracks(tracks);
            }
        }
    }
}

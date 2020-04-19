using MuziqApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WMPLib;

namespace MuziqApp.Core
{
    public class PlaylistManager : IDisposable
    {
        private Dictionary<string, Song> _playlist = null;
        private WindowsMediaPlayer _windowsMediaPlayer;
        public PlaylistManager(WindowsMediaPlayer mediaPlayer)
        {
            this._playlist = new Dictionary<string, Song>();
            this._windowsMediaPlayer = mediaPlayer;
            this._windowsMediaPlayer.currentPlaylist = CreatePlaylist();
        }

        private IWMPPlaylist CreatePlaylist()
        {
            return _windowsMediaPlayer.newPlaylist(Constants.Constants.PlaylistName, Constants.Constants.PlaylistPath);
        }

        public Song GetTrack(string trackID)
        {
            return GetPlaylist().FirstOrDefault(s => s.Id.Equals(trackID, StringComparison.InvariantCultureIgnoreCase));
        }

        public List<Song> GetPlaylist()
        {
            var list = new List<Song>();
            var count = this._windowsMediaPlayer.currentPlaylist.count;
            for (int i = 0; i < count; i++)
            {
                string mediaKey = this._windowsMediaPlayer.currentPlaylist.Item[i].getItemInfo(Constants.Constants.TrackId);
                if(_playlist.ContainsKey(mediaKey))
                {
                    Song song = this._playlist[mediaKey];
                    list.Add(song);
                }
            }

            return list;
        }

        public void RemoveTrack(Song song)
        {
            this._playlist.Remove(GetID(song.MediaData));
            this._windowsMediaPlayer.currentPlaylist.removeItem(song.MediaData);
        }

        public void AddTrack(Song song)
        {
            if (!Contains(song))
            {
                this._playlist.Add(GetID(song.MediaData), song);
                this._windowsMediaPlayer.currentPlaylist.appendItem(song.MediaData);
            }
        }

        public void AddTracks(List<Song> songs)
        {
            foreach(var track in songs)
            {
                if(!Contains(track))
                {
                    _playlist.Add(track.Id, track);
                    _windowsMediaPlayer.currentPlaylist.appendItem(track.MediaData);
                }
            }
        }

        public void Clear(string trackId = null)
        {
            if (String.IsNullOrEmpty(trackId))
            {
                this._playlist.Clear();
                this._windowsMediaPlayer.currentPlaylist.clear();
            }
            else
            {
                var keys = _playlist.Keys.ToList();
                foreach (var trackKey in keys)
                {
                    if (trackKey.Equals(trackId, StringComparison.InvariantCultureIgnoreCase)) continue;
                    this._playlist.Remove(trackKey);
                }

                for(var i = 0; i < _windowsMediaPlayer.currentPlaylist.count; i++)
                {
                    var media = _windowsMediaPlayer.currentPlaylist.Item[i];
                    if (GetID(media).Equals(trackId, StringComparison.InvariantCultureIgnoreCase)) continue;
                    _windowsMediaPlayer.currentPlaylist.removeItem(media);
                }
            }
        }

        public bool Contains(Song song)
        {
            return _playlist.ContainsValue(song);
        }

        public bool Contains(IWMPMedia media)
        {
            return _playlist.ContainsKey(GetID(media));
        }

        private string GetID(IWMPMedia media)
        {
            return media.getItemInfo(Constants.Constants.TrackId);
        }

        public void HandleIncomingTrack(Song song)
        {
            if (!Contains(song))
            {
                Clear();
                AddTrack(song);
            }
        }

        public void Synchroize()
        {
            _windowsMediaPlayer.currentPlaylist.clear();
            foreach (var track in _playlist.Values)
                _windowsMediaPlayer.currentPlaylist.appendItem(track.MediaData);
        }

        private bool IsDisposed = false;

        public void Dispose()
        {
            Dispose(IsDisposed);
            GC.SuppressFinalize(this);
            IsDisposed = true;
        }

        public virtual void Dispose(bool isDisposed)
        {
            if(!IsDisposed)
            {
                _playlist.Clear();
                _windowsMediaPlayer.currentPlaylist.clear();
                _windowsMediaPlayer.currentMedia = null;
                _playlist = null;
                _windowsMediaPlayer = null;
            }
        }
    }
}

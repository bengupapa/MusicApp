using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MuziqApp.Models;
using System.IO;
using MuziqApp.Utilities;
using MuziqApp.Interfaces;
using System.Configuration;

namespace MuziqApp.Core
{
    public sealed class MusicProvider : IMusicProvider, IDisposable
    {
        private static Dictionary<string, Artist> _artistsRepo = null;
        private static Dictionary<string, Song> _songsRepo = null;
        private static Dictionary<string, List<Album>> _artistAlbums = null;
        private static Dictionary<string, List<Song>> _albumSongs = null;

        private Dictionary<string, Artist> LoadArtists()
        {
            var artistsPaths = Directory.GetDirectories(ConfigurationManager.AppSettings["MusicDirectory"]);
            var artists = artistsPaths.Select(artistPath => new Artist()
            {
                Name = artistPath.GetName(),
                NumberOfAlbums = Directory.GetDirectories(artistPath).Count(),
                Directory = artistPath,
                Avatar = artistPath.GetAvatar()
            }).ToList();

            return artists.ToDictionary(a => a.Id);
        }
        public List<Artist> GetArtists()
        {
            if (_artistsRepo == null)
                _artistsRepo = LoadArtists();

            return _artistsRepo.Select(a => a.Value).ToList();
        }
        public Artist GetArtist(string artistId)
        {
            if (_artistsRepo == null || _artistsRepo.Count == 0 || !_artistsRepo.ContainsKey(artistId)) return null;

            return _artistsRepo[artistId];
        }

        private Dictionary<string, List<Album>> LoadAlbumsOfArtist(string artistId)
        {
            Artist artist;
            if (!_artistsRepo.TryGetValue(artistId, out artist))
                throw new ArgumentException($"Artist with ID: {artistId} could not found.");

            var albumPaths = Directory.GetDirectories(artist.Directory);
            var albums = albumPaths.Select(albumPath => new Album
            {
                ArtistId = artistId,
                Name = albumPath.GetName(),
                Directory = albumPath,
                ArtistName = artist.Directory.GetName()
            }).ToList();

            albums.ForEach(a => a.Songs = GetSongs(a));

            return new Dictionary<string, List<Album>>() { { artistId, albums } };
        }
        public List<Album> GetAlbums(string artistId)
        {
            List<Album> albums;
            if (_artistAlbums != null && _artistAlbums.TryGetValue(artistId, out albums))
            {
                return albums;
            }
            else if (_artistAlbums == null)
            {
                _artistAlbums = LoadAlbumsOfArtist(artistId);
                return _artistAlbums[artistId];
            }
            else
            {
                var artistAlbums = LoadAlbumsOfArtist(artistId);
                _artistAlbums.Add(artistId, artistAlbums[artistId]);
                return artistAlbums[artistId];
            }
        }
        public Album GetAlbum(string albumId)
        {
            if (_artistAlbums == null || _artistAlbums.Count == 0) return null;
            var albums = _artistAlbums.SelectMany(ar => ar.Value);
            return albums.FirstOrDefault(a => a.Id.Equals(albumId, StringComparison.InvariantCultureIgnoreCase));
        }

        public List<Song> GetSongs(Album album)
        {
            var songPaths = Directory.GetFiles(album.Directory, "*.mp3");
            var songs = songPaths
                .Select(songPath => MediaPlayer.Instance.GetMedia(songPath))
                .Select(mediaData => new Song(mediaData)
                {
                    AlbumId = album.Id,
                    Airtist = album.ArtistName,
                    Duration = mediaData.durationString
                }).ToList();

            if (_songsRepo == null) _songsRepo = new Dictionary<string, Song>();
            if (_albumSongs == null) _albumSongs = new Dictionary<string, List<Song>>();

            songs.ForEach(s => _songsRepo.Add(s.Id, s));
            _albumSongs.Add(album.Id, songs);

            return songs;
        }
        public Song GetSong(string songId)
        {
            Song song;
            if (!_songsRepo.TryGetValue(songId, out song))
                throw new KeyNotFoundException("Song not found");

            return song;
        }
        public List<Song> GetSongs(string albumId)
        {
            return (_albumSongs != null && _albumSongs.ContainsKey(albumId)) ? _albumSongs[albumId] : null;
        }

        public void Dispose()
        {
            _artistsRepo = null;
            _songsRepo = null;
            _artistAlbums = null;
            _musicProvider = null;
            _albumSongs = null;
        }

        private static IMusicProvider _musicProvider = null;
        public static IMusicProvider Instance
        {
            get
            {
                return _musicProvider ?? (_musicProvider = new MusicProvider());
            }
        }
    }
}

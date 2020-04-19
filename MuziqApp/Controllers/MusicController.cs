using MuziqApp.Constants;
using MuziqApp.Core;
using MuziqApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using static MuziqApp.Constants.Constants;

namespace MuziqApp.Controllers
{
    public class MusicController : Controller
    {
        public ActionResult Index()
        {
            AppDomain.CurrentDomain.SetPrincipalPolicy(System.Security.Principal.PrincipalPolicy.WindowsPrincipal);
            WindowsPrincipal principal = (WindowsPrincipal)Thread.CurrentPrincipal;

            IEnumerable<Artist> artists = MusicProvider.Instance.GetArtists();
            return View(artists);
        }

        public PartialViewResult GetAlbums(string artistId)
        {
            IEnumerable<Album> albums = MusicProvider.Instance.GetAlbums(artistId);
            return PartialView(AlbumsView, albums);
        }

        public void StopSong()
        {
            MediaPlayer.Instance.Stop();
        }

        public JsonResult PlaySong(string songId)
        {
            Song song = MusicProvider.Instance.GetSong(songId);
            PlayState state = MediaPlayer.Instance.Play(song);

            return Json(new { State = state }, JsonRequestBehavior.AllowGet);
        }

        public void AdjustVolume(int vol)
        {
            MediaPlayer.Instance.AdjustVolume(vol);
        }

        public void MuteSound(bool mute)
        {
            MediaPlayer.Instance.MuteSound(mute);
        }

        public JsonResult GetMediaState()
        {
            var mediaState = GetCurrentMediaState();
            return Json(mediaState, JsonRequestBehavior.AllowGet);
        }

        private MediaState GetCurrentMediaState()
        {
            MediaStateMessage stateMsg = MediaPlayer.Instance.GetMediaState();

            if (string.IsNullOrWhiteSpace(stateMsg.SongId)) return null;

            Song song = MusicProvider.Instance.GetSong(stateMsg.SongId);
            Album album = MusicProvider.Instance.GetAlbum(song.AlbumId);
            Artist artist = MusicProvider.Instance.GetArtist(album.ArtistId);

            return new MediaState()
            {
                SongId = song.Id,
                SongName = song.Name,
                AlbumId = album.Id,
                AlbumName = album.Name,
                ArtistId = artist.Id,
                ArtistName = artist.Name,
                State = stateMsg.State,
                Volume = stateMsg.Volume,
                Mode = stateMsg.RepeatMode,
                TrackTimespan = stateMsg.TrackTimespan
            };
        }

        public JsonResult GetSongState()
        {
            MediaStateMessage stateMsg = MediaPlayer.Instance.GetMediaState();
            return Json(stateMsg, JsonRequestBehavior.AllowGet);
        }

        public void SetRepeatMode(RepeatMode mode)
        {
            MediaPlayer.Instance.Repeat(mode);
        }

        public JsonResult AdjustProgress(double position)
        {
            double pos = MediaPlayer.Instance.AdjustProgress(position);
            return Json(pos, JsonRequestBehavior.AllowGet);
        }

        public PartialViewResult GetCurrentlyPlayingTrackView(MediaState mediaState)
        {
            MediaPlayer.Instance.UpdateMediaState(mediaState);
            return PartialView(CurrentlyPlayingView, mediaState);
        }

        public PartialViewResult GetCurrentlyPlayingView()
        {
            var mediaState = GetCurrentMediaState();
            return PartialView(CurrentlyPlayingView, mediaState);
        }

        public PartialViewResult GetPlaylist()
        {
            var playlist = MediaPlayer.Instance.GetPlaylist();
            return PartialView("_Playlist", playlist);
        }

        public PartialViewResult ClearPlaylist()
        {
            var mediaState = GetCurrentMediaState();
            MediaPlayer.Instance.ClearPlaylist();
            return PartialView(CurrentlyPlayingView, mediaState);
        }

        public void AddToPlaylist(string songId)
        {
            Song song = MusicProvider.Instance.GetSong(songId);
            MediaPlayer.Instance.AddTrack(song);
        }

        public void RemoveFromPlaylist(string songId)
        {
            Song song = MusicProvider.Instance.GetSong(songId);
            MediaPlayer.Instance.RemoveTrack(song);
        }

        public void UpdatePlaylistMediaState()
        {
            MediaPlayer.Instance.SendMediaState();
        }

        public void PlayNextTrack()
        {
            MediaPlayer.Instance.Next();
        }

        public void PlayPrevTrack()
        {
            MediaPlayer.Instance.Previous();
        }

        public void PlayAllTrackOfAlbum(string albumId)
        {
            var tracks = MusicProvider.Instance.GetSongs(albumId);
            MediaPlayer.Instance.PlayAllAlbumTracks(tracks);
        }

        public void AddAllTrackOfAlbum(string albumId)
        {
            var tracks = MusicProvider.Instance.GetSongs(albumId);
            MediaPlayer.Instance.AddAllAlbumTracks(tracks);
        }
    }
}
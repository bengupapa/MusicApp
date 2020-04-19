using MuziqApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Interfaces
{
    public interface IMusicProvider
    {
        List<Artist> GetArtists();
        List<Album> GetAlbums(string artistId);
        List<Song> GetSongs(Album album);
        List<Song> GetSongs(string albumId);
        Album GetAlbum(string albumId);
        Song GetSong(string songId);
        Artist GetArtist(string artistId);
    }
}

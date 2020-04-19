using MuziqApp.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Models
{
    public class MediaState
    {
        public string SongId { get; set; }
        public string SongName { get; set; }

        public string AlbumId { get; set; }
        public string AlbumName { get; set; }

        public string ArtistId { get; set; }
        public string ArtistName { get; set; }

        public PlayState State { get; set; }
        public int Volume { get; set; }
        public RepeatMode Mode { get; set; }
        public TrackTimespan TrackTimespan { get; set; }
    }
}

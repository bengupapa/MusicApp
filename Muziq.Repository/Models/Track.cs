using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Muziq.Repository.Models
{
    public class Track
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public double Duration { get; set; }
        public string Path { get; set; }
        public byte[] SongData { get; set; }

        public long ArtistId { get; set; }
        public long AlbumId { get; set; }
    }
}

using MuziqApp.Interfaces;
using MuziqApp.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MuziqApp.Models
{
    public partial class Artist
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public long NumberOfAlbums { get; set; }   
    }

    public partial class Artist
    {
        public string Avatar { get; set; }
        public string Directory { get; set; }
    }

    //TODO: Delete this partial class
    public partial class Artist
    {
        public List<Song> Song { get; set; }

        public Artist()
        {
            this.Song = new List<Song>();

            if (String.IsNullOrWhiteSpace(this.Id))
                this.Id = Guid.NewGuid().Map();
        }
    }
}
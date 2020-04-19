using MuziqApp.Interfaces;
using MuziqApp.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Models
{
    public partial class Album 
    { 
        public string Id { get; set; }
        public string ArtistId { get; set; }
        public string Name { get; set; }
        public int NumberOfSongs
        {
            get
            {
                return this.Songs.Count();
            }
        }
        public IEnumerable<Song> Songs { get; set; }

        public Album()
        {
            if (String.IsNullOrWhiteSpace(this.Id))
                this.Id = Guid.NewGuid().Map();
            this.Songs = new List<Song>();
        }
    }

    public partial class Album
    {
        public string ArtistName { get; set; }
        public string Directory { get; set; }
    }
}

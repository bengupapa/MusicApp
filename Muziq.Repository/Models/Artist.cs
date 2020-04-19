using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Muziq.Repository.Models
{
    public class Artist
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int NumberOfAlbums
        {
            get { return Albums.Count;  }
        }
        
        public ICollection<Album> Albums { get; }

        public Artist()
        {
            Albums = new HashSet<Album>();
        }
    }
}

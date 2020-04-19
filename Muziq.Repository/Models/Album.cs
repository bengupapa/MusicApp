using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Muziq.Repository.Models
{
    public class Album
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public double TotalDuration { get; set; }
        public string Path { get; set; }
        public int NumberOfTracks
        {
            get { return Tracks.Count; }
        }

        public long Artist { get; set; }
        public ICollection<Track> Tracks { get; private set; }

        public Album()
        {
            Tracks = new HashSet<Track>();
        }
    }
}

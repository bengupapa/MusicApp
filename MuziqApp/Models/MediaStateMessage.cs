using MuziqApp.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Models
{
    public class MediaStateMessage
    {
        public string SongId { get; set; }
        public PlayState State { get; set; }
        public int Volume { get; set; }
        public RepeatMode RepeatMode { get; set; }
        public TrackTimespan TrackTimespan { get; set; }
    }
}

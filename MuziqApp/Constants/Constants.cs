using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Constants
{
    public static class Constants
    {
        public static string AlbumsView = "_Albums";
        public static string CurrentlyPlayingView = "_CurrentlyPlaying";
        public static string PlaylistName = "MainPlaylist";
        public static string TrackId = "TRACKID";

        /// <summary>
        /// tracks are rewound to the begining
        /// </summary>
        public static string RepeatSong = "loop";

        /// <summary>
        /// Video frame diaplyed
        /// </summary>
        public static string ShowFrame = "showFrame";

        /// <summary>
        /// tracks are played in random
        /// </summary>
        public static string Shuffle = "shuffle";

        public static string DefaultImage = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Resources\default.jpeg"));
        public static string PlaylistPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Resources"));
    }
}

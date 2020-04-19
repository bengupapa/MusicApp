using MuziqApp.Interfaces;
using MuziqApp.Utilities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using WMPLib;

namespace MuziqApp.Models
{
    public partial class Song
    {
        public string Id { get; set; }
        public string Name => this.MediaData.name;
        public string Duration { get; set; }
        public string AlbumId { get; set; }

        public Song(IWMPMedia mediaData)
        {
            if (String.IsNullOrWhiteSpace(this.Id))
                this.Id = Guid.NewGuid().Map();

            this.MediaData = mediaData;
            this.MediaData.setItemInfo(Constants.Constants.TrackId, this.Id);
        }
    }

    public partial class Song
    {
        public string Airtist { get; set; }
        public string SongPath => this.MediaData.sourceURL;
        public string Externtion { get; set; }
        public IWMPMedia MediaData { get; set; }

        public override bool Equals(object obj)
        {
            return this.Id == ((Song)obj).Id;
        }
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}
using MuziqApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Interfaces
{
    public interface IMediaPlayer
    {
        void FastForward();
        void FastReverse();
        void Next();
        void Pause();
        void Play(Song song);
        void Previous();
        void Stop();
        Song CurrentMedia { get; }
    }
}

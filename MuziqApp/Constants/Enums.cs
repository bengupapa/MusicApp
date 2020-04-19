using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Constants
{
    public enum PlayState
    {
        Undefined = 0,
        Stopped = 1,
        Paused = 2,
        Playing = 3,
        ScanningForward = 4,
        ScanningBackward = 5,
        Buffering = 6,
        Idle = 7,
        MediaEnded = 8,
        Transitioning = 9,
        Ready = 10,
        Reconnecting = 11,
        Last = 12
    }

    public enum RepeatMode
    {
        Off = 0,
        Song = 1,
        Shuffle = 2
    }

    public enum MessageType
    {
        MediaStateMessage = 0,
        ProgressTimer = 1,
        TrackDetails = 2
    }
}

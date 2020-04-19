using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace MuziqApp.Core
{
    public class TimeManager : IDisposable
    {
        private Timer _timer = null;
        private Stopwatch _watch = null;

        public TimeManager()
        {
            _timer = new Timer(1000);
            _watch = new Stopwatch();
        }

        public Timer Timer
        {
            get
            {
                return this._timer;
            }
        }

        public void Start()
        {
            this._timer.Start();
            this._watch.Start();
        }

        public void Stop()
        {
            this._timer.Stop();
            this._watch.Stop();
        }

        public long ElapsedMilliSeconds
        {
            get
            {
                return this._watch.ElapsedMilliseconds;
            }
        }
        public TimeSpan ElapseTime
        {
            get
            {
                return this._watch.Elapsed;
            }
        }

        public void Dispose()
        {
            this._timer.Dispose();
            this._watch = null;
        }
    }
}

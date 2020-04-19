using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Hosting;
using MuziqApp.Models;

namespace MuziqApp.SignalHubs
{
    public class SignalRConnection : PersistentConnection
    {
        protected override Task OnReceived(IRequest request, string connectionId, string data)
        {
            return this.Connection.Broadcast(data);
        }

        public static void Notify<T>(Message<T> message)
        {
            var context = GlobalHost.ConnectionManager.GetConnectionContext<SignalRConnection>();
            context.Connection.Broadcast(message);
        }
    }
}

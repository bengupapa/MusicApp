using MuziqApp.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Models
{
    public class Message<T>
    {
        public MessageType MessageType { get; private set;}
        public T MessageObj { get; private set; }

        public Message(T msg, MessageType type)
        {
            this.MessageObj = msg;
            this.MessageType = type;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Externsions
{
    public static class Externsions
    {
        public static string SubStr(this string input, int len)
        {
            if (String.IsNullOrWhiteSpace(input) || input.Length <= 30) return input;
            return input.Substring(0, len);
        }
    }
}

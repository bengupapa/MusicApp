using MuziqApp.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MuziqApp.Utilities
{
    public static class Externsions
    {
        private static Dictionary<char, char> _repository = new Dictionary<char, char>
        {
            { '0', 'X' }, { '-', 'Y' },
            { '1', 'A' }, { '2', 'B' }, { '3', 'C' },
            { '4', 'D' }, { '5', 'E' }, { '6', 'F' },
            { '7', 'G' }, { '8', 'H' }, { '9', 'I' }
        };

        public static string GetName(this string str)
        {
            return Path.GetFileNameWithoutExtension(str);
        }

        public static string GetAvatar(this string str)
        {
            var imagePath = Directory.GetFiles(str, "*.jpg");

            return imagePath.Any() ? imagePath.First() : Constants.Constants.DefaultImage;
        }

        public static string Map(this Guid uniqueId)
        {
            var unique = uniqueId.ToString();

            foreach (var kvp in _repository)
                unique = unique.Replace(kvp.Key, kvp.Value);

            return unique.ToUpper();
        }
    }
}

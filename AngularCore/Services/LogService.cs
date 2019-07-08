using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AngularCore.Services
{
    public class LogService
    {
        StreamWriter file;
        LogService(string filepath)
        {
            file = new StreamWriter(filepath);
        }
        ~LogService()
        {
            file.Close();
        }
        public void writeLog(string type, string content)
        {
            file.WriteLine($"{DateTime.Now}:\n{type}-{content}");
        }

    }
    public class Log
    {
        public DateTime time { get; set; }
        public string type { get; set; }
        public string content { get; set; }
    }
}

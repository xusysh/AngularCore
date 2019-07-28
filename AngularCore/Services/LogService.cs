using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AngularCore.Services
{
    public class LogService
    {
        string filepath = null;
        public LogService(string filepath)
        {
            this.filepath = filepath;
        }
        public void AccessLog(string src_ip,string action,string content)
        {
            try
            {
                using(var file = new StreamWriter(filepath,true))
                {
                    file.WriteLine($"{src_ip}-{DateTime.Now}:\n{action}-{content}");
                    file.Flush();
                    file.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\nError from Service.LogService:{ex.Message}");
                throw;
            }
        }

    }

}

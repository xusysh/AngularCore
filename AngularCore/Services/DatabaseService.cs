using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using MySql.Data.Entity;

namespace AngularCore.Services
{
    public class DatabaseService
    {
        public MySqlConnection connection;
        public DatabaseService(string server, string uid, string pwd, string database,
            string charset = "utf-8", string SslMode = "None")
        {
            try
            {
                connection = new MySqlConnection($"server={server};uid={uid};pwd={pwd};database={database};" +
                    $"charset={charset};SslMode={SslMode}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Can't connect to database:{ex.Message}");
                return;
            }
            try
            {
                connection.Open();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Can't open database connection:{ex.Message}");
                return;
            }
        }
        ~DatabaseService()
        {
            connection.CreateCommand();
            connection.Close();
        }
    }
}

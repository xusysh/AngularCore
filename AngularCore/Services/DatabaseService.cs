using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using MySql.Data.Entity;
using System.Reflection;

namespace AngularCore.Services
{
    public class DatabaseService
    {
        MySqlConnection connection;
        public DatabaseService(string server, string uid, string pwd, string database,
            string charset = "utf8", string SslMode = "None")
        {
            try
            {
                connection = new MySqlConnection($"server={server};uid={uid};pwd={pwd};database={database};" +
                    $"charset={charset};SslMode={SslMode}");
                connection.Open();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error from Services.DatabaseService.DatabaseService:{ex.Message}");
                throw;
            }

        }

        ~DatabaseService()
        {
            try
            {
                connection.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error from Services.DatabaseService.~DatabaseService:{ex.Message}");
                throw;
            }
        }

        //判断传入的各种对象类型，插入一条相应的记录
        public void InsertRecord<T>(T obj,string table_name)       
        {
            try
            {
                //利用反射遍历对象，生成插入语句
                Type type = typeof(T);
                FieldInfo[] fields = type.GetFields();
                string cmd = $"insert into {table_name} values(";
                foreach (var field in fields)
                {
                    if (typeof(string).Equals(field.FieldType))
                        cmd += $"'{field.GetValue(obj)}',";
                    else 
                        cmd += $"{field.GetValue(obj)},";
                }
                cmd = cmd.Substring(0, cmd.Length - 1);         //删除多余的逗号
                cmd += ')';
                //执行插入事务
                var command = new MySqlCommand(cmd, connection);
                var transaction = connection.BeginTransaction();
                command.ExecuteNonQuery();
                transaction.Commit();
                command.Dispose();
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Error from Services.DatabaseService.InsertRecord:{ex.Message}");
                throw;
            }
        }

        //获取若干条记录，返回泛型对象集合
        public IEnumerable<T> GetRecords<T>(string table_name, string key = null, string value = null)
        {
            //获取对象类型
            Type type = typeof(T);
            FieldInfo[] fields = type.GetFields();
            try
            {
                var transaction = connection.BeginTransaction();

                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "mytable";
                MySqlDataReader reader = cmd.ExecuteReader();

                transaction.Commit();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error from Services.DatabaseService.GetRecords:{ex.Message}");
                throw;
            }

            return null;
        }
    }
}

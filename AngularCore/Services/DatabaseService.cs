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
                    if (typeof(string).Equals(field.FieldType) || typeof(DateTime).Equals(field.FieldType))
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

        //从数据库获取若干条记录，返回指定对应类型的对象集合
        public IEnumerable<T> GetRecords<T>(string table_name,
            string key = null, string value = null, string options = null)
        {
            try
            {
                //生成格式化查询语句
                string cmd = $"select * from {table_name}" +
                    $"{(key == null ? "" : $" where {key} = ")}{value}" +
                    $"{(options == null ? "" : $" {options}")}";
                //进行查询
                var command = new MySqlCommand(cmd, connection);
                MySqlDataReader reader = command.ExecuteReader();
                //准备数据库返回的object对象数组（一行多个不同类元素抽象为object）
                object[] vals = new object[reader.FieldCount];
                //准备指定对应类型的对象集合（多行）
                List<T> objs = new List<T>();
                while (reader.Read())
                {
                    //生成指定类型的对象实例
                    T obj = Activator.CreateInstance<T>();
                    //通过反射获取对象的所有属性类型
                    FieldInfo[] fields = typeof(T).GetFields();
                    int i = 0;
                    //获取一行元素作为一个对象数组
                    reader.GetValues(vals);
                    //遍历对象属性类型和对象数组，进行赋值
                    foreach (var field in fields)
                    {
                        field.SetValue(obj, vals[i]);
                        i++;
                    }
                    //添加一个对象（一行）
                    objs.Add(obj);
                }
                reader.Close();
                return objs.AsEnumerable();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error from Services.DatabaseService.GetRecords:{ex.Message}");
                throw;
            }
        }

        //从数据库获取某个元素的平均值
        public int GetAvgElem(string table_name,string elem_name,
            string key = null, string value = null, string options = null)
        {
            try
            {
                //生成格式化查询语句
                string cmd = $"select round(avg({elem_name})) from {table_name}" +
                    $"{(key == null ? "" : $" where {key} = ")}{value}" +
                    $"{(options == null ? "" : $" {options}")}";
                //进行查询
                var command = new MySqlCommand(cmd, connection);
                MySqlDataReader reader = command.ExecuteReader();
                reader.Read();
                int val = Convert.ToInt32(reader.GetValue(0));
                reader.Close();
                return val;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error from Services.DatabaseService.GetRecords:{ex.Message}");
                throw;
            }
        }

    }
}

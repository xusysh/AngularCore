using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AngularCore.Services;
using System.Threading;

namespace AngularCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckRecordsController : ControllerBase
    {
        DatabaseService db_service = new DatabaseService("111.231.69.132", "root", "admin", "AngularCoreDB");

        [HttpGet("[action]")]
        public IEnumerable<Comment> GetComments()
        {
            return db_service.GetRecords<Comment>("comments", null, null, "order by id desc");
        }

        [HttpPost("[action]")]
        public IEnumerable<Record> GetRecords([FromBody]Uname uname)
        {
            int type_num_avg_grade = db_service.GetAvgElem("type_num_records", "grade");
            var type_num_highest_record = db_service.GetRecords<Record>("type_num_records",null,null, "order by grade desc");
            int type_ch_avg_grade = db_service.GetAvgElem("type_ch_records", "grade");
            var type_ch_highest_record = db_service.GetRecords<Record>("type_ch_records");

            int type_num_avg_grade_user = db_service.GetAvgElem("type_num_records", "grade", "uname", $"'{uname.uname}'");
            var type_num_highest_record_user = db_service.GetRecords<Record>("type_num_records", "uname", $"'{uname.uname}'",
                "order by grade desc");
            int type_ch_avg_grade_user = db_service.GetAvgElem("type_ch_records", "grade", "uname", $"'{uname.uname}'");
            var type_ch_highest_record_user = db_service.GetRecords<Record>("type_ch_records", "uname", $"'{uname.uname}'",
                "order by grade desc");

            List<Record> records = new List<Record>();

            var record = new Record();
            record.grade = type_num_avg_grade;
            records.Add(record);
            records.Add(type_num_highest_record.First());
            record = new Record();
            record.grade = type_ch_avg_grade;
            records.Add(record);
            records.Add(type_ch_highest_record.First());

            record = new Record();
            record.grade = type_num_avg_grade_user;
            records.Add(record);
            records.Add(type_num_highest_record_user.First());
            record = new Record();
            record.grade = type_ch_avg_grade_user;
            records.Add(record);
            records.Add(type_ch_highest_record_user.First());

            return records.AsEnumerable();
        }

        [HttpPost("[action]")]
        public MyResponse RecvComment([FromBody]Comment comment)
        {
            db_service.InsertRecord(comment, "comments");
            return new MyResponse("post received");
        }

        [HttpPost("[action]")]
        public void InsertComment([FromBody]Comment comment)
        {
            try
            {
                db_service.InsertRecord(comment,"comments");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error from Controllers.CheckRecordsController.InsertComment: {ex.Message}");
                throw;
            }
        }

    }

    public class Comment
    {
        public int id;
        public string uname;
        public string content;
        public DateTime datetime;
    }

    public class Uname
    {
        public string uname;
    }

}
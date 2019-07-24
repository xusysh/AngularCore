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

}
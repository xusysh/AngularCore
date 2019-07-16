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
        DatabaseService databaseService = new DatabaseService("111.231.69.132", "root", "admin", "AngularCoreDB");
        [HttpGet("[action]")]
        public IEnumerable<Comment> GetComments()
        {
            return Enumerable.Range(1, 6).Select(index => new Comment
            {
                id = index,
                uname = $"user{index}",
                content = $"content{index}",
                datetime = DateTime.Now.AddDays(index).ToString("d"),
            });
        }
    }

    public class Comment
    {
        public int id;
        public string uname;
        public string content;
        public string datetime;
    }
}
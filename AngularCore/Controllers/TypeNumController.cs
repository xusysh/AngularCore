using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AngularCore.Services;

namespace AngularCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeNumController : ControllerBase
    {
        DatabaseService db_service = new DatabaseService("111.231.69.132", "root", "admin", "AngularCoreDB");
        LogService log_service = new LogService("../../logfiles/access.log");

        [HttpPost("[action]")]
        public MyResponse RecvPost([FromBody]Record record)
        {
            db_service.InsertRecord(record, "type_num_records");
            return new MyResponse("post received");
        }

        [HttpPost("[action]")]
        public MyResponse RecvEnteredMsg([FromBody]MyPostMsg post_msg)
        {
            string ip = HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (string.IsNullOrEmpty(ip))
                ip = HttpContext.Connection.RemoteIpAddress.ToString();
            log_service.AccessLog(ip, "Post", "TypeNumEntered");
            return new MyResponse("post received");
        }

    }

    public class Record
    {
        public int id;
        public string uname;
        public int grade;
    }

    public class MyResponse
    {
        public string msg;
        public MyResponse(string msg)
        {
            this.msg = msg;
        }
    }

    public class MyPostMsg
    {
        public string msg;
    }
}
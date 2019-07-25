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
    public class TypeChController : ControllerBase
    {
        DatabaseService db_service = new DatabaseService("111.231.69.132", "root", "admin", "AngularCoreDB");

        [HttpPost("[action]")]
        public MyResponse RecvPost([FromBody]Record record)
        {
            db_service.InsertRecord(record, "type_ch_records");
            return new MyResponse("post received");
        }
    }
}
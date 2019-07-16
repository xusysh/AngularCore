using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AngularCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeNumController : ControllerBase
    {
        [HttpPost("[action]")]
        public MyResponse RecvPost([FromBody]record record)
        {
            return new MyResponse("zhidaole");
        }

        public class record
        {
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
    }
}
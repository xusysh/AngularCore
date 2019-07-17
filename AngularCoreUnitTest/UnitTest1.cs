using Microsoft.VisualStudio.TestTools.UnitTesting;
using AngularCore.Services;
using AngularCore.Controllers;
using System;

namespace AngularCoreUnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void InsertComment_Test()
        {
            CheckRecordsController checkRecordsController = new CheckRecordsController();
            Comment comment = new Comment
            {
                id = 2,
                uname = $"user{2}",
                content = $"content{2}",
                datetime = DateTime.Now.ToString(),
            };
            checkRecordsController.InsertComment(comment);
        }

        [TestMethod]
        public void GetComments_Test()
        {
            CheckRecordsController checkRecordsController = new CheckRecordsController();
            Comment comment = new Comment
            {
                id = 2,
                uname = $"user{2}",
                content = $"content{2}",
                datetime = DateTime.Now.ToString(),
            };
            checkRecordsController.InsertComment(comment);
        }
    }
}

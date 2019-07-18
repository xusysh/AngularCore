using Microsoft.VisualStudio.TestTools.UnitTesting;
using AngularCore.Services;
using AngularCore.Controllers;
using System;

namespace AngularCoreUnitTest
{
    [TestClass]
    public class UnitTest1
    {
        CheckRecordsController checkRecordsController = new CheckRecordsController();

        [TestMethod]
        public void InsertComment_Test()
        {
            Comment comment = new Comment
            {
                id = 2,
                uname = $"user{2}",
                content = $"content{2}",
                datetime = DateTime.Now,
            };
            checkRecordsController.InsertComment(comment);
        }

        [TestMethod]
        public void GetComments_Test()
        {
            var result = checkRecordsController.GetComments();
            result.GetEnumerator();
        }
    }
}

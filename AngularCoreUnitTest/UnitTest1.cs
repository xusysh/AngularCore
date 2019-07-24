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
        TypeNumController typeNumController = new TypeNumController();

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

        [TestMethod]
        public void PostRecord_Test()
        {
            Record record = new Record
            {
                id = 0,
                uname = "asd",
                grade = 60
            };
            typeNumController.RecvPost(record);
        }

        [TestMethod]
        public void GetRecords_Test()
        {
            Uname uname = new Uname
            {
                uname = "test1",
            };
            checkRecordsController.GetRecords(uname);
        }

    }
}

using Sabio.Web.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sabio.Web.Controllers
{
    [RoutePrefix("Contact")]
    public class ContactUsController : BaseController
    {
        [Route("{ContactId:int}")]
        [Route("Post")]
        public ActionResult manage_ng(int? ContactId = null)
        {
            ItemViewModel<int?> vm = new ItemViewModel<int?>();
            vm.Item = ContactId;
            return View(vm);
        }
        [Route("List")]
        public ActionResult List_ng()
        {
            return View();
        }
    }
}
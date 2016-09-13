using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace signalR_Tunnel.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/
        public ActionResult PasswordError()
        {
            ViewBag.Title = "密码错误，你想干啥?";
            return View();
        }
	}
}
using System.Web.Mvc;

namespace signalR_Tunnel.Controllers
{
    public class HomeController : Controller
    {
        //public bool CheckPassword(string password) {
        //    return password == Util.Util.pswd;
        //}

        public ActionResult Index(string password)
        {

            //if (password != Util.Util.pswd) {
            //    RedirectToAction("PasswordError", "Error");
            //}

            return View();
        }

        //public ActionResult FileSubmit() {

        //    var file = Request.Files["file"];


        //    return View();

        //}



    }
}
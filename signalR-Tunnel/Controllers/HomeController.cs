using System.Web.Mvc;

namespace signalR_Tunnel.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FileSubmit() {

            var file = Request.Files["file"];


            return View();

        }

    }
}
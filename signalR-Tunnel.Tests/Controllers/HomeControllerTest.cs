using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using signalR_Tunnel.Controllers;

namespace signalR_Tunnel.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void Index()
        {
            // Arrange
            HomeController controller = new HomeController();

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
        }

      
    }
}

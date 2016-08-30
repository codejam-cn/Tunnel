using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(signalR_Tunnel.Startup))]
namespace signalR_Tunnel
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
               
            app.MapSignalR();
        }
    }
}

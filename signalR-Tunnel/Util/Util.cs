using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace signalR_Tunnel.Util
{
    public class Util
    {
        public static string pswd = ConfigurationManager.AppSettings["loginPswd"].ToString();
    }
}
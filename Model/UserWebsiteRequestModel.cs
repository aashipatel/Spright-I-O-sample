using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sabio.Web.Models.Requests
{
    public class UserWebsiteRequestModel
    {
       public string UserId { get;set;}
       public int[] WebsiteId { get; set; }
    }
}


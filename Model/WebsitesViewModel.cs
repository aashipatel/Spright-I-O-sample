using Sabio.Web.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sabio.Web.Models.ViewModels
{
    public class WebsitesViewModel : HomePageViewModel
    {
        public Website website { get; set; }
        public CMSPage cmsPage { get; set; }
        public List<Domain.Blog> blog { get; set; }
        public Blog blogpost { get; set; }
    }
}
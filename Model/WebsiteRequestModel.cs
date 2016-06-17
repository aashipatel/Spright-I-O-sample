using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Sabio.Web.Models.Requests.Website
{
    public class WebsiteRequestModel
    {
        public int ID { get; set; }
        
        [Required]
        public string Name { get; set; }

        [Required]
        public string Slug { get; set; }

        [Required]
        public string Url { get; set; }

        [Required]
        public string Theme { get; set; }

        [Required]
        public string Description { get; set; }

        public bool  Active { get; set; }

    }
}
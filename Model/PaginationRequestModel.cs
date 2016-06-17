using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Sabio.Web.Models.Requests.EVA
{
    public class PaginateListRequestModel
    {
        public int CurrentPage { get; set; }

        public int ItemsPerPage { get; set; }

        public string Query { get; set; }

    }
}
using Sabio.Web.Models;
using Sabio.Web.Models.Responses;
using Sabio.Web.Services;
using Sabio.Web.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    //main route so you referense api/contact/
    [RoutePrefix("api/contact")]
    public class ContactApiController : ApiController
    {
        private IContactService _ContactService { get; set; }

        public ContactApiController(IContactService ContactService)
        {
            _ContactService = ContactService;

        }
        [Route("{contactId:int}"),HttpGet]
        public HttpResponseMessage getById(int contactId)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            ItemResponse<Domain.Contact> response = new ItemResponse<Domain.Contact>();
            //create service method and pass in model 
            response.Item = _ContactService.GetByID(contactId);
            return Request.CreateResponse(response);
        }

        // Make post method here 
        [Route("post"), HttpPost]
        //url="api/contact/post";
        public HttpResponseMessage post(ContactRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            ItemResponse<int> response = new ItemResponse<int>();
            //create service method and pass in model 
            response.Item = _ContactService.Add(model);

            return Request.CreateResponse(response);
        }//Ending of route post

        //Make PUt Method
        [Route("{ContactId:int}"), HttpPut]
        //url="api/contact/put";
        public HttpResponseMessage Update(ContactRequest model, int ContactId)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            ItemResponse<bool> response = new ItemResponse<bool>();
            //create service method and pass in model 
            _ContactService.Update(model, ContactId);
            response.Item = true;
            return Request.CreateResponse(response);
        }//Ending of route post


        //List Contact
        [Route("list"), HttpGet]
        public HttpResponseMessage getContact()
        {
            // here it will check for model first 
           
            ItemsResponse<Domain.Contact> response = new ItemsResponse<Domain.Contact>();
            response.Items = _ContactService.GetContacts();
            return Request.CreateResponse(response);
        }

        //delete
        [Route("{ContactId:int}"), HttpDelete]
        public HttpResponseMessage DeleteContactById(int ContactId)
        {
            SuccessResponse response = new SuccessResponse();

            _ContactService.DeleteContactById(ContactId);

            return Request.CreateResponse(response);
        }
    }
}
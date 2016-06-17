using Sabio.Data;
using Sabio.Web.Models.Requests;
using Sabio.Web.Models.Requests.Website;
using Sabio.Web.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Sabio.Web.Domain;

namespace Sabio.Web.Services
{
    public class WebsiteServices : BaseService, IWebsiteServices
    {
        // create a vehicle
        public int InsertWebsite(WebsiteRequestModel model)
        {
            int uid = 0;
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Website_Insert"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   //paramCollection.AddWithValue("@UserID", "32000");
                   paramCollection.AddWithValue("@Name", model.Name);
                   paramCollection.AddWithValue("@Slug", model.Slug);
                   paramCollection.AddWithValue("@Url", model.Url);
                   paramCollection.AddWithValue("@Theme", model.Theme);
                   paramCollection.AddWithValue("@Description", model.Description);
                   paramCollection.AddWithValue("@Active", model.Active);

                   SqlParameter p = new SqlParameter("@OID", System.Data.SqlDbType.Int);
                   p.Direction = System.Data.ParameterDirection.Output;
                   paramCollection.Add(p);
               }, returnParameters: delegate (SqlParameterCollection param)
               {
                   int.TryParse(param["@OID"].Value.ToString(), out uid);
               }
               );
            return uid;
        }

        // update a website
        public void UpdateWebsite(WebsiteRequestModel model)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Website_Update"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@ID", model.ID);
                   paramCollection.AddWithValue("@Name", model.Name);
                   paramCollection.AddWithValue("@Slug", model.Slug);
                   paramCollection.AddWithValue("@Url", model.Url);
                   paramCollection.AddWithValue("@Theme", model.Theme);
                   paramCollection.AddWithValue("@Description", model.Description);
                   paramCollection.AddWithValue("@Active", model.Active);
               
               }, returnParameters: delegate (SqlParameterCollection param)
               {
               }
               );
        }

        // delete a website
        public void DeleteWebsite(int id)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Website_Delete"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@ID", id);
               }, returnParameters: delegate (SqlParameterCollection param)
               {
               }
               );
        }

        // list website by User ID
        public List<Domain.Website> GetWebsiteByUserID(string id)
        {
            List<Domain.Website> list = null;

            DataProvider.ExecuteCmd(GetConnection, "dbo.Website_SelectByUserID"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@UserID", id);

               }, map: delegate (IDataReader reader, short set)
               {
                   Domain.Website p = new Domain.Website();
                   int startingIndex = 0; //startingOrdinal

                   p.ID = reader.GetSafeInt32(startingIndex++);
                   p.Name = reader.GetSafeString(startingIndex++);
                   p.Slug = reader.GetSafeString(startingIndex++);
                   p.Url = reader.GetSafeString(startingIndex++);
                   p.Theme = reader.GetSafeString(startingIndex++);
                   p.Description = reader.GetSafeString(startingIndex++);
                   p.Active = reader.GetSafeBool(startingIndex++);

                   if (list == null)
                   {
                       list = new List<Domain.Website>();
                   }

                   list.Add(p);
               }
               );

            return list;
        }

        // list all websites
        public List<Domain.Website> GetAllWebsites()
        {
            List<Domain.Website> list = null;

            DataProvider.ExecuteCmd(GetConnection, "dbo.Website_SelectAll"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {


               }, map: delegate (IDataReader reader, short set)
               {
                   Domain.Website p = new Domain.Website();
                   int startingIndex = 0; //startingOrdinal

                   p.ID = reader.GetSafeInt32(startingIndex++);
                   p.Name = reader.GetSafeString(startingIndex++);
                   p.Slug = reader.GetSafeString(startingIndex++);
                   p.Url = reader.GetSafeString(startingIndex++);
                   p.Theme = reader.GetSafeString(startingIndex++);
                   p.Description = reader.GetSafeString(startingIndex++);
                   p.Active = reader.GetSafeBool(startingIndex++);
                   if (list == null)
                   {
                       list = new List<Domain.Website>();
                   }
                   list.Add(p);
               }
               );

            return list;
        }

        // list website by site ID
        public Domain.Website GetWebsiteByID(int ID)
        {
            Domain.Website item = null;

            DataProvider.ExecuteCmd(GetConnection, "dbo.Website_SelectByID"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@ID", ID);

               }, map: delegate (IDataReader reader, short set)
               {
                   Domain.Website p = new Domain.Website();
                   int startingIndex = 0; //startingOrdinal

                   p.ID = reader.GetSafeInt32(startingIndex++);
                   p.Name = reader.GetSafeString(startingIndex++);
                   p.Slug = reader.GetSafeString(startingIndex++);
                   p.Url = reader.GetSafeString(startingIndex++);
                   p.Theme = reader.GetSafeString(startingIndex++);
                   p.Description = reader.GetSafeString(startingIndex++);
                   p.Active = reader.GetSafeBool(startingIndex++);
                   item = p;
               }
               );
            return item;
        }

        // UserWebsite insert method
        public void InsertUserWebsite(UserWebsiteRequestModel model)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.UserWebsite_Insert"
          , inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    SqlParameter c = new SqlParameter("@WebsiteId", SqlDbType.Structured);
                    if (model.WebsiteId != null && model.WebsiteId.Any())
                    {
                        c.Value = new IntIdTable(model.WebsiteId);
                    }
                    paramCollection.Add(c);
                });
        }

        // list website by site ID
        public Domain.Website GetWebsiteBySlug(string slug)
        {
            Domain.Website item = null;

            DataProvider.ExecuteCmd(GetConnection, "dbo.Website_SelectBySlug"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@Slug", slug);

               }, map: delegate (IDataReader reader, short set)
               {
                   Domain.Website p = new Domain.Website();
                   int startingIndex = 0; //startingOrdinal

                   p.ID = reader.GetSafeInt32(startingIndex++);
                   p.Name = reader.GetSafeString(startingIndex++);
                   p.Slug = reader.GetSafeString(startingIndex++);
                   p.Url = reader.GetSafeString(startingIndex++);
                   p.Theme = reader.GetSafeString(startingIndex++);
                   p.Description = reader.GetSafeString(startingIndex++);
                   p.Active = reader.GetSafeBool(startingIndex++);
                   item = p;
               }
               );
            return item;
        }



    }
}

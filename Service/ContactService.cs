using Sabio.Data;
using Sabio.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Sabio.Web.Services.Interfaces;

namespace Sabio.Web.Services
{
    public class ContactService : BaseService , IContactService
    {

        public  int Add(ContactRequest model)

        {
            int id = 0;

            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Contact_Insert"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@FullName", model.FullName);
                   paramCollection.AddWithValue("@Subject", model.Subject);
                   paramCollection.AddWithValue("@Email", model.Email);
                   paramCollection.AddWithValue("@Message", model.Message);

                   SqlParameter p = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                   p.Direction = System.Data.ParameterDirection.Output;

                   paramCollection.Add(p);

               }, returnParameters: delegate (SqlParameterCollection param)

               {
                   int.TryParse(param["@Id"].Value.ToString(), out id);
               }
               );
            return id;
        }

        public  void Update(ContactRequest model, int ContactId)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Contact_Update"
                , inputParamMapper: delegate (SqlParameterCollection updateParam)
                 {
                     updateParam.AddWithValue("@Id", ContactId);
                     updateParam.AddWithValue("@FullName", model.FullName);
                     updateParam.AddWithValue("@Subject", model.Subject);
                     updateParam.AddWithValue("@Email", model.Email);
                     updateParam.AddWithValue("@Message", model.Message);
                 }
                );
        }

        public  List<Domain.Contact> GetContacts()
        {
            List<Domain.Contact> list = null;
            DataProvider.ExecuteCmd(GetConnection, "dbo.Contact_SelectAll"
               , inputParamMapper: null
               , map: delegate (IDataReader reader, short set)
               {
                  
                   Domain.Contact c = new Domain.Contact();
                   int startingIndex = 0;
                   c.Id = reader.GetSafeInt32(startingIndex++);
                   c.FullName = reader.GetSafeString(startingIndex++);
                   c.Subject = reader.GetSafeString(startingIndex++);
                   c.Email = reader.GetSafeString(startingIndex++);
                   c.Message = reader.GetSafeString(startingIndex++);

                   if (list == null)
                   {
                       list = new List<Domain.Contact>();
                   }
                   list.Add(c);
               }
               );

            
            return list;
        }


        public Domain.Contact GetByID(int id)
        {
            Domain.Contact p = null;

            DataProvider.ExecuteCmd(GetConnection, "dbo.Contact_SelectById"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@Id", id);

               }, map: delegate (IDataReader reader, short set)
               {
                   p = new Domain.Contact();
                   int startingIndex = 0; //startingOrdinal
                   p.Id = reader.GetSafeInt32(startingIndex++);
                   p.FullName = reader.GetSafeString(startingIndex++);
                   p.Subject = reader.GetSafeString(startingIndex++);
                   p.Email = reader.GetSafeString(startingIndex++);
                   p.Message = reader.GetSafeString(startingIndex++);

               }
               );
            return p;
        }

        public void DeleteContactById(int id)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Contact_Delete"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@ID", id);

               }, returnParameters: delegate (SqlParameterCollection param)
               {
               }
               );

        }
    }
}

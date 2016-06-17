using Sabio.Web.Models.Requests;
using System.Data.SqlClient;
using System;
using Sabio.Web.Models;
using Sabio.Data;
using System.Data;
using Sabio.Web.Services.Interfaces;

namespace Sabio.Web.Services
{
    public class AccountService : BaseService, IAccountService
    {
        public void UserAccount(UserAccountRequest model, string UserId)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Users_UpdateAccount"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@FirstName", model.FirstName);
                   paramCollection.AddWithValue("@LastName", model.LastName);
                   paramCollection.AddWithValue("@Id", UserId);

               }, returnParameters: delegate (SqlParameterCollection param)
               {
               }
               );
        }
        //Update Avatar by Id
        public void UpdateUserMediaId(UserManagerRequestModel model, Guid Id)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Users_UpdateMediaId"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@UserId", Id);
                   paramCollection.AddWithValue("@MediaId", model.MediaId);


               }, returnParameters: delegate (SqlParameterCollection param)
               {

               });
        }

        //Update Upload User Background
        public void UpdateUserBackground(UserManagerRequestModel model, Guid Id)
        {
            DataProvider.ExecuteNonQuery(GetConnection, "dbo.Users_UpdateBackground"
               , inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@UserId", Id);
                   paramCollection.AddWithValue("@UserBackground", model.MediaId);


               }, returnParameters: delegate (SqlParameterCollection param)
               {

               });
        }
    }

  

    }




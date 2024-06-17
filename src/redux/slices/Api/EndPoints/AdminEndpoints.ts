import { apiSlice  } from "../clientApi";

export const AdminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        
   
        adminlogin: builder.mutation({
            query: (data) => ({
                url: '/admin/login',
                method: 'POST',
                body: data,
                
            }),
        }), 
        getUsersAdmin: builder.query({
            query: (userId) => ({
              url: `/admin/users/${userId}`,
              method: 'GET',
            }),
          }),
          blockUser: builder.mutation({
            query: (userId: string) => ({
                url: `/admin/block/${userId}`,
                method: 'PUT',
            }),
        }),
        
        }),
      });
      
      export const {
        useAdminloginMutation,
        useBlockUserMutation,
        useGetUsersAdminQuery
        
   
} = AdminApiSlice
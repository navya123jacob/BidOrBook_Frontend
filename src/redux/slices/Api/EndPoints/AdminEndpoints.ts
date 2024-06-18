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
            query: () => ({
              url: `/admin/users`,
              method: 'GET',
            }),
          }),
          blockUser: builder.mutation({
            query: (userId: string) => ({
                url: `/admin/block/${userId}`,
                method: 'PUT',
            }),
        }),
        adminlogout: builder.mutation({
          query: () => ({
              url: '/admin/logout',
              method: 'GET',
          }),
      }),
        
        }),
      });
      
      export const {
        useAdminloginMutation,
        useBlockUserMutation,
        useGetUsersAdminQuery,
        useAdminlogoutMutation
        
   
} = AdminApiSlice
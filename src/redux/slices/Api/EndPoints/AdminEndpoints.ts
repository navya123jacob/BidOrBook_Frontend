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
      updateAdmin: builder.mutation({
        query: (data) => ({
          url: '/admin/adminprofile',
          method: 'PUT',
          body: data,
        }),
      }),
        
        }),
      });
      
      export const {
        useUpdateAdminMutation,
        useAdminloginMutation,
        useBlockUserMutation,
        useGetUsersAdminQuery,
        useAdminlogoutMutation
        
   
} = AdminApiSlice
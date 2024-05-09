import { apiSlice } from "./clientApi";
const CLIENT_URL = '/';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        adminLogin: builder.mutation({
            query:(data)=> ({
                url:`${CLIENT_URL}`,
                method:'GET',
                body: data,
            })
        })       
        

    })
})

export const {
    useAdminLoginMutation,
   
} = adminApiSlice
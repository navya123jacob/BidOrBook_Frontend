import { ArrowLeftEndOnRectangleIcon, ArrowLongDownIcon } from "@heroicons/react/24/outline";
import { apiSlice } from "./clientApi";
const CLIENT_URL = '/users';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        signup: builder.mutation({
            query: (user) => ({
                url: '/signup',
                method: 'POST',
                body: user,
            }),
        }),     
        login: builder.mutation({
            query: (user) => ({
                url: '/login',
                method: 'POST',
                body: user,
            }),
        }),     
        

    })
})

export const {
    useSignupMutation,
    useLoginMutation
   
} = adminApiSlice
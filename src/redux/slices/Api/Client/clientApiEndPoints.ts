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
        resendOtp: builder.mutation({
            query: () => ({
                url: '/resendOtp',
                method: 'POST'
                
            }),
        }),     
        verifyOtp: builder.mutation({
            query: (user) => ({
                url: '/verifyotp',
                method: 'POST',
                body: user,
                
            }),
        }),     
            
        clientprofile: builder.mutation({
            query: (user) => ({
                url: '/clientprofile',
                method: 'PUT',
                body: user,
                
            }),
        }),     
        createpost: builder.mutation({
            query: (user) => ({
                url: '/createpost',
                method: 'POST',
                body: user,
                
            }),
        }),     
        allpost: builder.mutation({
            query: (user) => ({
                url: '/allpost',
                method: 'POST',
                body: user,
                
            }),
        }),     
        

    })
})

export const {
    useSignupMutation,
    useLoginMutation,
    useResendOtpMutation,
    useVerifyOtpMutation,
    useClientprofileMutation,
    useCreatepostMutation,
    useAllpostMutation
   
} = adminApiSlice
import { apiSlice } from "../clientApi";

export const UserApiSlice = apiSlice.injectEndpoints({
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
        forgotpassword: builder.mutation({
            query: (user) => ({
                url: '/forgotpassword',
                method: 'POST',
                body: user,
                
            }),
        }),     
        setpassword: builder.mutation({
            query: (user) => ({
                url: '/setpassword',
                method: 'POST',
                body: user,
                
            }),
        }),     
        verifyotp2: builder.mutation({
            query: (user) => ({
                url: '/verifyotp2',
                method: 'POST',
                body: user,
                
            }),
        }),     
        forgotresendOtp: builder.mutation({
            query: () => ({
                url: '/forgotresendOtp',
                method: 'GET'
                
                
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
        
        singleUserPost: builder.mutation({
            query: (userId: string) => ({
                url: `/singleposts/${userId}`, 
                method: 'POST',
            }),
        }),    
        SingleUser: builder.mutation({
            query: (userId: string) => ({
                url: `/SingleUser/${userId}`,
                method: 'GET',
            }),
        }),    
        deletePost: builder.mutation({
            query: (user) => ({
                url: '/deletepost',
                method: 'DELETE',
                body: user,
                
            }),
        }),     
        
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'GET',
            }),
        }),
   
        sendMessage: builder.mutation({
            query: (message) => ({
                url: '/sendMessage',
                method: 'POST',
                body: message,
            }),
        }),
        getMessages: builder.mutation({
            query: (data) => ({
                url: `/getMessages`,
                method: 'POST',
                body: data,
            }),
        }),
        getUserChats: builder.query({
            query: (userId) => ({
              url: `/getUserChats/${userId}`,
              method: 'GET',
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
    useAllpostMutation,
    useDeletePostMutation,
    useLogoutMutation,
    useForgotpasswordMutation,
    useVerifyotp2Mutation,
    useSetpasswordMutation,
    useForgotresendOtpMutation,
    useSingleUserPostMutation,
    useGetMessagesMutation,
    useSendMessageMutation,
    useSingleUserMutation,
    useGetUserChatsQuery
   
} = UserApiSlice
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
          SpamUser: builder.mutation({
            query: ({ userId, reason,id }: { userId: string; reason: string,id:string }) => ({
                url: `/spam/${id}`,
                method: 'POST',
                body: { reason,userId },
            }),
        }),
        unspamUser: builder.mutation({
            query: ({ userId,id }: { userId: string,id:string }) => ({
              url: `/unspam/${id}`,
              method: 'POST',
              body: {userId },
            }),
          }),
        spamPost: builder.mutation({
            query: ({ userId,id ,reason}: { userId: string,id:string ,reason:string}) => ({
              url: `/postsspam/${id}`,
              method: 'POST',
              body: {userId ,reason},
            }),
          }),
        UnspamPost: builder.mutation({
            query: ({ userId,id }: { userId: string,id:string }) => ({
              url: `/postsunspam/${id}`,
              method: 'POST',
              body: {userId },
            }),
          }),
          getPostsWithSpam: builder.query({
            query: () => ({
                url:'/posts-with-spam',
                method:'GET'
            })
          }),
          blockPost: builder.mutation({
            query: (postId) => ({
              url: `/${postId}/block`,
              method: 'POST',
            }),
          }),
          unblockPost: builder.mutation({
            query: (postId) => ({
              url: `/${postId}/unblock`,
              method: 'POST',
            }),
          }),

    })
})

export const {
    useBlockPostMutation,
    useUnblockPostMutation,
    useGetPostsWithSpamQuery,
    useSpamPostMutation,
    useUnspamPostMutation,
    useSpamUserMutation,
    useUnspamUserMutation,
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
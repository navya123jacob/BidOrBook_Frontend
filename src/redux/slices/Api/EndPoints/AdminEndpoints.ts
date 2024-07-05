import { apiSlice } from "../clientApi";
import { Admin } from "../../../../types/admin";
import { IEvent } from "../../../../types/Event";

export const AdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminlogin: builder.mutation({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
    }),
    getUsersAdmin: builder.query({
      query: () => ({
        url: `/admin/users`,
        method: "GET",
      }),
    }),
    blockUser: builder.mutation({
      query: (userId: string) => ({
        url: `/admin/block/${userId}`,
        method: "PUT",
      }),
    }),
    adminlogout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "GET",
      }),
    }),
    updateAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/adminprofile",
        method: "PUT",
        body: data,
      }),
    }),
    getAdminDetails: builder.query<Admin, void>({
      query: () => "/admin/details",
    }),
    AdmindeleteAuction: builder.mutation<
      any,
      { auctionId: string; userId: string }
    >({
      query: ({ auctionId, userId }) => ({
        url: `/admin/auctions/${auctionId}`,
        method: "DELETE",
        body: { userId },
      }),
    }),
    getAllAuctionsWithUserDetails: builder.query({
      query: () => "/admin/auctions/userdetails",
    }),
    getPostsWithSpam: builder.query({
      query: () => ({
        url: "/admin/posts-with-spam",
        method: "GET",
      }),
    }),
    blockPost: builder.mutation({
      query: (postId) => ({
        url: `/admin/${postId}/block`,
        method: "POST",
      }),
    }),
    unblockPost: builder.mutation({
      query: (postId) => ({
        url: `/admin/${postId}/unblock`,
        method: "POST",
      }),
    }),
    Admincancelbooking: builder.mutation({
      query: (data) => ({
        url: "/admin/cancel-booking",
        method: "POST",
        body: data,
      }),
    }),
    getBookingsByArtistAndClient: builder.query({
      query: () => `/admin/Allbookings`,
    }),
    AdmingetUserChats: builder.query({
      query: (userId) => ({
        url: `/admin/getUserChats/${userId}`,
        method: "GET",
      }),
    }),
    AdminSendMessage: builder.mutation({
      query: (message) => ({
        url: "/admin/sendMessage",
        method: "POST",
        body: message,
      }),
    }),
    AdminGetMessages: builder.mutation({
      query: (data) => ({
        url: `/admin/getMessages`,
        method: "POST",
        body: data,
      }),
    }),

    getEvents: builder.query({
      query: (type: string) => ({
        url: `/admin/events/${type}`,
        method: "GET",
      }),
    }),

    deleteEvent: builder.mutation({
      query: (eventId: string) => ({
        url: `/admin/events/${eventId}`,
        method: "DELETE",
      }),
    }),
    createEvent: builder.mutation<IEvent, Partial<IEvent>>({
      query: (event) => ({
        url: `/admin/event`,
        method: "POST",
        body: event,
      }),
    }),
  }),
});

export const {
  useGetBookingsByArtistAndClientQuery,
  useUpdateAdminMutation,
  useAdminloginMutation,
  useBlockUserMutation,
  useGetUsersAdminQuery,
  useAdminlogoutMutation,
  useGetAdminDetailsQuery,
  useAdmindeleteAuctionMutation,
  useGetAllAuctionsWithUserDetailsQuery,
  useBlockPostMutation,
  useUnblockPostMutation,
  useGetPostsWithSpamQuery,
  useAdmincancelbookingMutation,
  useAdmingetUserChatsQuery,
  useAdminSendMessageMutation,
  useAdminGetMessagesMutation,
  useGetEventsQuery,
  useDeleteEventMutation,
  useCreateEventMutation
} = AdminApiSlice;

import { apiSlice  } from "../clientApi";

export const BookingApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        
   
        checkavailability: builder.mutation({
            query: (dates) => ({
                url: '/checkavailability',
                method: 'POST',
                body: dates,
                
            }),
        }), 
        makeBookingreq: builder.mutation({
            query: (data) => ({
                url: '/makeBookingreq',
                method: 'POST',
                body: data,
                
            }),
        }), 
        bookingsreq: builder.mutation({
            query: (data) => ({
                url: '/bookingsreq',
                method: 'POST',
                body: data,
                
            }),
        }), 
        bookingsConfirm: builder.mutation({
            query: (data) => ({
                url: '/bookingsConfirmed',
                method: 'POST',
                body: data,
                
            }),
        }), 
        marked: builder.mutation({
            query: (data) => ({
                url: '/marked',
                method: 'POST',
                body: data,
                
            }),
        }), 
        done: builder.mutation({
            query: (data) => ({
                url: '/done',
                method: 'POST',
                body: data,
                
            }),
        }), 
      
        SingleBooking: builder.query({
            query: ({ artistId, clientId }) => ({
              url: `/bookings/${artistId}/${clientId}`,
              method: 'GET',
            }),
          }),
          cancelbooking: builder.mutation({
            query: (data) => ({
                url: '/cancel-booking',
                method: 'POST',
                body: data,
                
            }),
        }), 
        updatebooking: builder.mutation({
            query: (data) => ({
                url: '/update-booking',
                method: 'PUT',
                body: data,
                
            }),
        }), 
        cancelPaymentReq: builder.mutation({
            query: (data) => ({
                url: '/cancelPaymentReq',
                method: 'DELETE',
                body: data,
                
            }),
        }), 
        createCheckoutSession: builder.mutation({
            query: (data) => ({
                url: '/create-checkout-session',
                method: 'POST',
                body: data,
                
            }),
        }), 
        createCheckoutSessionAuction: builder.mutation({
            query: (data) => ({
                url: '/create-checkout-session-auction',
                method: 'POST',
                body: data,
                
            }),
        }), 
        wallet: builder.mutation({
            query: (data) => ({
                url: '/wallet-payment',
                method: 'POST',
                body: data,
                
            }),
        }), 
        
        findAvailablePeople: builder.mutation({
            query: (data) => ({
                url: '/find-available-people',
                method: 'POST',
                body: data,
                
            }),
        }), 
        
        
        }),
      });
      
      export const {
        
        useCheckavailabilityMutation,
        useMakeBookingreqMutation,
        useBookingsreqMutation,
        useBookingsConfirmMutation,
        useMarkedMutation,
        useSingleBookingQuery,
        useCancelbookingMutation,
        useUpdatebookingMutation,
        useCancelPaymentReqMutation,
        useCreateCheckoutSessionMutation,
        useCreateCheckoutSessionAuctionMutation,
        useWalletMutation,
        useFindAvailablePeopleMutation,
        useDoneMutation
        
   
} = BookingApiSlice
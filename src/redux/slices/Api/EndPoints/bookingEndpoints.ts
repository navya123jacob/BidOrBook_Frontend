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
        }),
      });
      
      export const {
        useCheckavailabilityMutation,
        useMakeBookingreqMutation,
        useBookingsreqMutation,
        useBookingsConfirmMutation,
        useMarkedMutation,
        useSingleBookingQuery,
        useCancelbookingMutation
   
} = BookingApiSlice
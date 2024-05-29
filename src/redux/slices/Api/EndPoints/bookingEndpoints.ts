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

    })
})

export const {
    
    useCheckavailabilityMutation,
    useMakeBookingreqMutation,
    useBookingsreqMutation,
    useBookingsConfirmMutation
   
} = BookingApiSlice
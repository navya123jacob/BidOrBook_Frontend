import { apiSlice  } from "../clientApi";

export const AuctionApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        
   
        createauction: builder.mutation({
            query: (dates) => ({
                url: '/createauction',
                method: 'POST',
                body: dates,
                
            }),
        }), 
        placebid: builder.mutation({
            query: (dates) => ({
                url: '/place-bid',
                method: 'POST',
                body: dates,
                
            }),
        }), 
        cancelBid: builder.mutation({
            query: (data) => ({
                url: '/cancelBid',
                method: 'POST',
                body: data,
                
            }),
        }), 
       
    allAuctions: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({
        url: `/auctions/user/${userId}`,
        method: 'GET',
      }),
    }),
    deleteAuction: builder.mutation<any, { auctionId: string; userId: string }>({
      query: ({ auctionId, userId }) => ({
        url: `/auctions/${auctionId}`,
        method: 'DELETE',
        body: { userId },
      }),
    }),
        }),
      });
      
      export const {
        useCreateauctionMutation,
        useAllAuctionsMutation,
        useDeleteAuctionMutation,
        usePlacebidMutation,
        useCancelBidMutation   

} = AuctionApiSlice
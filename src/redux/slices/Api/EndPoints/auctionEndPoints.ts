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
       
        allAuctions: builder.mutation<any, { userId: string, notId: string }>({
          query: ({ userId, notId }) => ({
            url: `/auctions/user/${userId}?notId=${notId}`,
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
    walletAuction: builder.mutation({
      query: (data) => ({
          url: '/wallet-payment-auction',
          method: 'POST',
          body: data,
          
      }),
  }), 
    AuctionByBidder: builder.mutation({
      query: (data) => ({
          url: '/auctions-by-bidder',
          method: 'POST',
          body: data,
          
      }),
  }), 
        }),
      });
      
      export const {
        useAuctionByBidderMutation,
        useCreateauctionMutation,
        useAllAuctionsMutation,
        useDeleteAuctionMutation,
        usePlacebidMutation,
        useCancelBidMutation ,
        useWalletAuctionMutation  

} = AuctionApiSlice
export interface Post {
    _id: string;
    userid: string;
    name: string;
    description: string;
    image: string;
    __v: number;
  }
  
  export interface User {
    _id: string;
    isAdmin: boolean;
    Fname: string;
    Lname: string;
    email: string;
    phone: number;
    password: string;
    posts: Post[];
    auction: any[];
    category: string;
    receivedReviews: any[];
    givenReviews: any[];
    purchasedItems: any[];
    bookings: any[];
    marked: any[];
    is_verified: boolean;
    is_google: boolean;
    profile: string;
    is_blocked: boolean;
    description: string;
    refreshToken: string;
    addresses: any[];
    __v: number;
  }
  
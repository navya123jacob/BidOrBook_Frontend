export interface Post {
    _id: string;
    userid: string;
    name: string;
    description: string;
    image: string;
    __v: number;
    spam?:Spam[];
    is_blocked:boolean
  }

  export interface IPost {
    _id: string;
    userid: {
      _id: string;
      Fname: string;
      Lname: string;
      profile:string
    };
    name: string;
    description: string;
    image: string;
    spam: ISpam[];
    is_blocked: boolean;
  }
  export interface Location {
    
    state: string;
    district: string;
    country: string;
}

export interface Spam {
  userId: string;
  reason: string;
}
export interface ISpam {
  userId: User;
  reason: string;
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
    category: string;
    bookings: any[];
    is_verified: boolean;
    is_google: boolean;
    profile: string;
    is_blocked: boolean;
    description: string;
    refreshToken: string;
    location: Location;
    __v: number;
    spam: Spam[];
  }
 
  export interface IUser {
    _id: string;
    isAdmin: boolean;
    Fname: string;
    Lname: string;
    email: string;
    phone: number;
    password: string;
    posts: Post[];
    category: string;
    bookings: any[];
    is_verified: boolean;
    is_google: boolean;
    profile: string;
    is_blocked: boolean;
    description: string;
    refreshToken: string;
    location: Location;
    __v: number;
    spam: ISpam[];
  }
 
  
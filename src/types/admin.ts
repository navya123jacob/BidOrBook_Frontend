export interface Admin {
    _id: string
    email: string;
    password: string;
    isAdmin: boolean;
    refreshToken?: string;
    Fname:string;
    Lname:string,
    profile:string,
    bg:string
  }
  
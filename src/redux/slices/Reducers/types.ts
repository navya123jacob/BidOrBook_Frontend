
export interface ClientState {
    userInfo: any; 
    document: string | null;
    bookings:number 
  }

 export interface RootState {
    client: ClientState;
    
  }
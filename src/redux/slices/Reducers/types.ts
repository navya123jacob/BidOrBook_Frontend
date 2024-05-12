
export interface ClientState {
    userInfo: any; 
    document: string | null; 
  }

 export interface RootState {
    client: ClientState;
    
  }
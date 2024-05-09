
export interface ClientState {
    userInfo: string | null; 
    document: string | null; 
  }

 export interface RootState {
    client: ClientState;
    // Add other slice states as needed
  }
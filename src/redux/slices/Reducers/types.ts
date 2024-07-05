export interface ClientState {
  userInfo: any; 
  document: string | null;
  bookings: number;
}

export interface AdminState {
  adminInfo: any;
}

export interface OnlineUsersState {
  onlineUsers: string[];
}

export interface RootState {
  client: ClientState;
  adminAuth: AdminState;
  userStatus: OnlineUsersState;  
}

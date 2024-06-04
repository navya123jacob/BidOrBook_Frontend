import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientState } from './types';

const userInfoFromLocalStorage = localStorage.getItem('userInfo');

const userInfo = userInfoFromLocalStorage ? JSON.parse(userInfoFromLocalStorage) : null;
const initialState: ClientState = { 
  userInfo,
  document: null,
  bookings:0
};

const ClientSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => { 
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => { 
       state.userInfo = null;
       localStorage.removeItem('userInfo');
    },
    setDocument: (state, action: PayloadAction<string>) => { 
      state.document = action.payload;
    },
    setBookings:(state, action: PayloadAction<number>) => { 
      state.bookings = action.payload;
    },
  },
});

export const { setCredentials, logout, setDocument,setBookings } = ClientSlice.actions;

export default ClientSlice.reducer;

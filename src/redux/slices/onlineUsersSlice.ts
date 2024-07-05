import { createSlice } from '@reduxjs/toolkit';

const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState: {
    onlineUsers: [] as string[],
  },
  reducers: {
    userOnline: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userOffline: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(userId => userId !== action.payload);
    },
  },
});

export const { userOnline, userOffline } = userStatusSlice.actions;
export default userStatusSlice.reducer;

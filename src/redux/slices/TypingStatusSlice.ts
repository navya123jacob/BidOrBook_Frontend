import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypingStatusState {
  [userId: string]: boolean;
}

const initialState: TypingStatusState = {};

const typingStatusSlice = createSlice({
  name: 'typingStatus',
  initialState,
  reducers: {
    userTyping: (state, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    userStoppedTyping: (state, action: PayloadAction<string>) => {
      state[action.payload] = false;
    },
  },
});

export const { userTyping, userStoppedTyping } = typingStatusSlice.actions;
export default typingStatusSlice.reducer;

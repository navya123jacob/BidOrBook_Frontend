import { configureStore } from '@reduxjs/toolkit';
import ClientReducer from './slices/Reducers/ClientReducer';
import { apiSlice } from './slices/Api/clientApi';
import AdminReducer from './slices/Reducers/AdminReducer'
import onlineReducer from './slices/onlineUsersSlice';
import TypingReducer from './slices/TypingStatusSlice';
const store = configureStore({
    reducer: {
        client: ClientReducer,
        adminAuth: AdminReducer,
        userStatus:onlineReducer,
        typingStatus:TypingReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

export default store;

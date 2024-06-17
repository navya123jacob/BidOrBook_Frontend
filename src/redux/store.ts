import { configureStore } from '@reduxjs/toolkit';
import ClientReducer from './slices/Reducers/ClientReducer';
import { apiSlice } from './slices/Api/clientApi';
import AdminReducer from './slices/Reducers/AdminReducer'


const store = configureStore({
    reducer: {
        client: ClientReducer,
        adminAuth: AdminReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

export default store;

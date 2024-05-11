import { configureStore } from '@reduxjs/toolkit';
import ClientReducer from './slices/Reducers/ClientReducer';
import { apiSlice } from './slices/Api/Client/clientApi';
// import adminAuthSlice from './slices/adminSlice/adminAuthSlice';


const store = configureStore({
    reducer: {
        client: ClientReducer,
        // adminAuth: adminAuthSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

export default store;

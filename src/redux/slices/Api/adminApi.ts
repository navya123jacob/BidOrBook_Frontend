import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const adminBaseQuery = fetchBaseQuery({ baseUrl: `http://localhost:8888/admin`, credentials: 'include' });

export const adminApiSlice = createApi({
    baseQuery: adminBaseQuery,
    tagTypes: ['Admin'],
    endpoints: () => ({})
});

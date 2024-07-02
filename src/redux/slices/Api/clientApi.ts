import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
// `http://localhost:8888`
const official='https://bidorbook.xyz'
const baseQuery=fetchBaseQuery({ baseUrl: official , credentials: 'include'})

export const apiSlice=createApi({
    baseQuery,
    tagTypes:['Client','Artist','Admin'],
    endpoints:()=>({})
})
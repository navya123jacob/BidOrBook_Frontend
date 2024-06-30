import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
// const url = io("http://localhost:8888");
const official='https://bidorbook.xyz/'
console.log(official)
const baseQuery=fetchBaseQuery({ baseUrl: official , credentials: 'include'})

export const apiSlice=createApi({
    baseQuery,
    tagTypes:['Client','Artist','Admin'],
    endpoints:()=>({})
})
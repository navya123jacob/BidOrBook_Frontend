import { createSlice } from '@reduxjs/toolkit'
const adminInfoFromLocalStorage = localStorage.getItem('adminInfo');
const adminInfo = adminInfoFromLocalStorage ? JSON.parse(adminInfoFromLocalStorage) : null;
const initialState = {
   adminInfo
   
}

const adminAuthSlice = createSlice({   
    name: 'adminAuth',
    initialState: initialState,
    reducers: {
        setAdminCredentials: (state, action) => {
            state.adminInfo = action.payload;
            localStorage.setItem('adminInfo', JSON.stringify(action.payload));
        },
        adminLogout: (state, action) => {
            state.adminInfo = null;
            localStorage.removeItem('adminInfo');
        }
    }
});

export const { setAdminCredentials, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

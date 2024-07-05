import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
console.log('checking',import.meta.env.VITE_OFFICIAL)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
  domain="dev-2j0jzjuikcfrmqs4.us.auth0.com"
  clientId="9HuPTVRmDFjux2QLuyTPw9Pxcztqzi1G"
  authorizationParams={{
    redirect_uri: window.location.origin + "/signup" 
  }}
>
  <Provider store={store}>
  <React.StrictMode>
  <ToastContainer/>
  
    <App />
    
  </React.StrictMode>
  </Provider>
  </Auth0Provider>
)

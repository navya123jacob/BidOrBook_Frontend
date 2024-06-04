import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeUser from './Pages/User/HomeUser';
import LoginUser from './Pages/User/LoginUser';
import { useSelector } from 'react-redux';
import { RootState } from './redux/slices/Reducers/types';
import HomeArtPho from './Pages/User/ArtPho/HomeArtPho';
import { SignupUser } from './Pages/User/SignupUser';
import ClientProfilePage from './Pages/User/ClientProfilePage';
import { ProtectedArtistRoute, ProtectedClientRoute } from './Components/Protected';
import ProfilesSellers from './Pages/User/ArtPho/Sellers';
import ProfilePageSeller from './Pages/User/ArtPho/SellerProfile';
import ProfileSellerClientSide from './Pages/User/SellerProfileClientside';

function App(): JSX.Element {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={!userInfo ? <SignupUser /> : <Navigate to="/" />} />
        <Route path="/" element={!userInfo ? <LoginUser /> : (userInfo.client ? <HomeUser /> : <HomeArtPho />)} />

        <Route element={<ProtectedArtistRoute />}>
          <Route path="/artpho/profile" element={<ProfilePageSeller />} />
        </Route>

        <Route element={<ProtectedClientRoute />}>
          {/* client-specific routes */}
          <Route path="/profile" element={<ClientProfilePage />} />
          <Route path="/groupprofiles" element={<ProfilesSellers />} />
          <Route path="/artprof/client/:id" element={<ProfileSellerClientSide />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices/Reducers/types';

export const ProtectedArtistRoute = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  return userInfo && !userInfo.client ? <Outlet /> : <Navigate to="/" />;
};

export const ProtectedClientRoute = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  return userInfo && userInfo.client ? <Outlet /> : <Navigate to="/" />;
};
export const ProtectedAdminRoute = () => {
  const adminInfo = useSelector((state: RootState) => state.adminAuth.adminInfo);
  return adminInfo ? <Outlet /> : <Navigate to="/admin" />;
};
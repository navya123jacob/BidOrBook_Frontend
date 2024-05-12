import { BrowserRouter,Routes,Route} from 'react-router-dom';
import { Hero } from './Components/User/Hero';
import HomeUser from './Pages/User/HomeUser';
import LoginUser from './Pages/User/LoginUser';
import { useSelector } from 'react-redux';
import { RootState } from './redux/slices/Reducers/types';
import HomeArtPho from './Pages/User/ArtPho/HomeArtPho';
import { SignupUser } from './Pages/User/SignupUser';


function App(): JSX.Element {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  console.log(userInfo)
  return (
   <BrowserRouter>
   <Routes>
    {/* User */}
    <Route path="/" element={!userInfo?<LoginUser/>:(userInfo.client==true?<HomeUser/>:<HomeArtPho/>)}/>
    <Route path="/signup" element={!userInfo?<SignupUser/>:(userInfo.client==true?<HomeUser/>:<HomeArtPho/>)}/>
    


   </Routes>
   </BrowserRouter>
  );
}

export default App;

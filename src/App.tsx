import { BrowserRouter,Routes,Route} from 'react-router-dom';
import { Hero } from './Components/User/Hero';
import HomeUser from './Pages/User/HomeUser';
import LoginUser from './Pages/User/LoginUser';


function App(): JSX.Element {
  return (
   <BrowserRouter>
   <Routes>
    {/* client */}
    <Route path="/" element={<HomeUser/>}/>
    <Route path="/login" element={<LoginUser/>}/>


   </Routes>
   </BrowserRouter>
  );
}

export default App;

import { BrowserRouter,Routes,Route} from 'react-router-dom';
import { Hero } from './Components/User/Hero';
import HomeUser from './Pages/User/HomeUser';


function App(): JSX.Element {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<HomeUser/>}/>
   </Routes>
   </BrowserRouter>
  );
}

export default App;

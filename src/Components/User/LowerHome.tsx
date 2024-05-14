import { Link } from 'react-router-dom';
import {  useSelector } from "react-redux";
import { RootState } from '../../redux/slices/Reducers/types';
const LowerHome = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  return (
    <section className="section">
    <div className="cards">
      <a href="#" className="card card-1">
        <figure className="visual">
         
          {userInfo && userInfo.data?.message?.profile ? (
        <img src={userInfo.data?.message?.profile} className="card-img" alt="User Profile" />
      ) : (
        <img className="card-img" src="src/assets/HomeProfDummy.jpg" alt="Default Image" />
      )}
          <figcaption className="figcaption2">Go To Your Profile {userInfo?.data?.message?.Fname}</figcaption>
        </figure>
      </a>
      <a href="#" className="card card-2">
        <figure className="visual">
          <img
            className="card-img"
            src="src/assets/HomeAbout.jpg"
            alt="Person with curly hair in neon lighting"
          />
          <figcaption className="figcaption2">About Us</figcaption>
        </figure>
      </a>
     
    
    </div>
  </section>
  
  )
}

export default LowerHome

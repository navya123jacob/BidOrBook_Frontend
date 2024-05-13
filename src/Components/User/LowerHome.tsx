import React from 'react'
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
        <img className="card-img" src="https://raw.githubusercontent.com/mobalti/ui/main/cards-01/images/img-1.avif" alt="Default Image" />
      )}
          <figcaption className="figcaption">Early Access</figcaption>
        </figure>
      </a>
      <a href="#" className="card card-2">
        <figure className="visual">
          <img
            className="card-img"
            src="https://raw.githubusercontent.com/mobalti/ui/main/cards-01/images/img-2.avif"
            alt="Person with curly hair in neon lighting"
          />
          <figcaption className="figcaption">Top Sellers</figcaption>
        </figure>
      </a>
      <a href="#" className="card card-3">
        <figure className="visual">
          <img
            className="card-img"
            src="https://raw.githubusercontent.com/mobalti/ui/main/cards-01/images/img-3.avif"
            alt="Person in vibrant neon lighting with abstract shapes"
          />
          <figcaption className="figcaption">New Releases</figcaption>
        </figure>
      </a>
      <a href="#" className="card card-4">
        <figure className="visual">
          <img
            className="card-img"
            src="https://raw.githubusercontent.com/mobalti/ui/main/cards-01/images/img-4.avif"
            alt="Person wearing a virtual reality headset in a blue-lit room"
          />
          <figcaption className="figcaption">Upcoming</figcaption>
        </figure>
      </a>
    </div>
  </section>
  
  )
}

export default LowerHome

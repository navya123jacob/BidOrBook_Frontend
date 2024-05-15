import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';

const LowerHome = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [captionPosition, setCaptionPosition] = useState('');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 401) {
        setCaptionPosition('bottom-0'); // For screens less than or equal to 401px
      } else if (width <= 971) {
        setCaptionPosition('top-0'); // For screens between 401px and 971px
      } else {
        setCaptionPosition('top-1/2 transform -translate-y-1/2'); // For screens larger than 971px
      }
    };

    // Check the screen size on initial render
    handleResize();

    // Add event listener to update state on window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="section">
      <div className="cards">
        <Link to="/profile" className="card card-1">
          <figure className="visual">
            <img
              className="card-img"
              src="src/assets/HomeProfDummy.jpg"
              alt="Default Image"
            />
            <figcaption
              className={`figcaption2 absolute ${captionPosition} w-full flex items-center justify-center  `}
            >
              Go To Your Profile {userInfo?.data?.message?.Fname}
            </figcaption>
          </figure>
        </Link>
        <a href="#" className="card card-2">
          <figure className="visual">
            <img
              className="card-img"
              src="src/assets/HomeAbout.jpg"
              alt="Person with curly hair in neon lighting"
            />
            <figcaption
              className={`figcaption2 absolute ${captionPosition} w-full flex items-center justify-center   `}
            >
              About Us
            </figcaption>
          </figure>
        </a>
      </div>
    </section>
  );
};

export default LowerHome;

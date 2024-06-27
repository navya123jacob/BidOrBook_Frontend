import  { useEffect, useState } from 'react';
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
        setCaptionPosition('bottom-0'); 
      } else if (width <= 971) {
        setCaptionPosition('top-0'); 
      } else {
        setCaptionPosition('top-1/2 transform -translate-y-1/2'); 
      }
    };

    
    handleResize();

    window.addEventListener('resize', handleResize);

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
              src="/HomeProfDummy.jpg"
              alt="Default Image"
            />
            <figcaption
              className={`figcaption2 absolute ${captionPosition} w-full flex items-center justify-center  `}
            >
              Go To Your Profile {userInfo?.data?.message?.Fname}
            </figcaption>
          </figure>
        </Link>
        <a href="/about" className="card card-2">
          <figure className="visual">
            <img
              className="card-img"
              src="/HomeAbout.jpg"
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

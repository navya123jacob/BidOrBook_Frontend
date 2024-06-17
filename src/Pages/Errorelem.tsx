import React, { useEffect } from 'react';
import $ from 'jquery';
import '../Errorstyle.scss';
import { Link } from 'react-router-dom';

const ParallaxPage: React.FC = () => {
  useEffect(() => {
    let lFollowX = 0,
        lFollowY = 0,
        x = 0,
        y = 0,
        friction = 1 / 30;

    function animate() {
      x += (lFollowX - x) * friction;
      y += (lFollowY - y) * friction;
      
      const translate = `translate(${x}px, ${y}px) scale(1.1)`;

      $('.parallax-img').css({
        '-webkit-transform': translate,
        '-moz-transform': translate,
        'transform': translate
      });

      window.requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const lMouseX = Math.max(-100, Math.min(100, window.innerWidth / 2 - e.clientX));
      const lMouseY = Math.max(-100, Math.min(100, window.innerHeight / 2 - e.clientY));
      lFollowX = (20 * lMouseX) / 100;
      lFollowY = (10 * lMouseY) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseMove);

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseMove);
    };
  }, []);

  return (
    <div className="parallax-page">
      
      <div className="parallax-content">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>I tried to catch some fog, but I mist</p>
        <Link to="/">Back to Home</Link>
      </div>
      <img className="parallax-img" src="http://www.supah.it/dribbble/008/008.jpg" alt="Background" />
    </div>
  );
};

export default ParallaxPage;

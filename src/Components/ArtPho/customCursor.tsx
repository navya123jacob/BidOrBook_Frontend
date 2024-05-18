import React, { useEffect, useRef } from 'react';

import $ from 'jquery'; 

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursor2Ref = useRef<HTMLDivElement>(null);
  const cursor3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && cursor2Ref.current && cursor3Ref.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        cursor2Ref.current.style.left = `${e.clientX}px`;
        cursor2Ref.current.style.top = `${e.clientY}px`;
        cursor3Ref.current.style.left = `${e.clientX}px`;
        cursor3Ref.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = () => {
      if (cursor2Ref.current && cursor3Ref.current) {
        cursor2Ref.current.classList.add('hover');
        cursor3Ref.current.classList.add('hover');
      }
    };

    const handleMouseOut = () => {
      if (cursor2Ref.current && cursor3Ref.current) {
        cursor2Ref.current.classList.remove('hover');
        cursor3Ref.current.classList.remove('hover');
      }
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    const hoverTargets = document.querySelectorAll('.hover-target');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseover', handleMouseOver);
      target.addEventListener('mouseout', handleMouseOut);
    });

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      hoverTargets.forEach(target => {
        target.removeEventListener('mouseover', handleMouseOver);
        target.removeEventListener('mouseout', handleMouseOut);
      });
    };
  }, []);

  useEffect(() => {
    $(".about-text").on('click', function () {
      $("body").addClass("about-on");
    });
    $(".about-close").on('click', function () {
      $("body").removeClass("about-on");
    });

    $(".contact-text").on('click', function () {
      $("body").addClass("contact-on");
    });
    $(".contact-close").on('click', function () {
      $("body").removeClass("contact-on");
    });

    $(".travel").on('click', function () {
      $("body").addClass("travel-on");
    });
    $(".travel-close").on('click', function () {
      $("body").removeClass("travel-on");
    });

    $(".wildlife").on('click', function () {
      $("body").addClass("wildlife-on");
    });
    $(".wildlife-close").on('click', function () {
      $("body").removeClass("wildlife-on");
    });

    $(".nature").on('click', function () {
      $("body").addClass("nature-on");
    });
    $(".nature-close").on('click', function () {
      $("body").removeClass("nature-on");
    });
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor2" ref={cursor2Ref}></div>
      <div id="cursor3" ref={cursor3Ref}></div>
    </>
  );
};

export default CustomCursor;

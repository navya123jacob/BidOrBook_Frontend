import React from "react";
import { Navbar } from "../Components/User/Navbar";
import Footer from "../Components/User/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <section className="ezy__about14 light py-24 md:py-32 bg-[url('/About.jpeg')] bg-cover bg-no-repeat bg-center text-white relative z-[1]">
        <header className="absolute inset-x-0 top-0 z-50">
          <Navbar />
        </header>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 -z-[1]" />
        <h1 className="uppercase text-4xl md:text-6xl leading-tight font-medium mb-6 text-center">
          ABOUT US
        </h1>
        <div className="container px-4">
          <div className="grid grid-cols-12 gap-5 justify-between items-center">
            <div className="col-span-12 lg:col-span-5">
              <div className="border-[2px] border-white p-6 lg:p-12 flex flex-col justify-center items-center">
                <img
                  src="https://res.cloudinary.com/dvgwqkegd/image/upload/v1717316271/bufdnw6hnanv5yrky0qm.jpg"
                  className=" h-auto w-64"
                  alt="About Us"
                />
                <p className="text-lg leading-normal opacity-75 mt-4 text-center">
                  Navya T. Jacob, a native of Kozhikode, Kerala, started her
                  work as a software developer at the age of 24. Navya developed
                  this website BID&BOOK with great dedication after developing a
                  passion for photography and painting. She used her ingenuity
                  to create a website for everyone.
                </p>
                <div className="mt-6 ">
                  <Link to="/">
                    <button className="border-[1px] border-white text-white py-3 px-6 transition hover:bg-opacity-90">
                      Home
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7 ">
              <div className="lg:ml-12">
                <p className="text-lg leading-normal opacity-75 mb-9">
                At Bid or Book, we extend our platform to encompass not just photographers but also a vibrant community of artists ready to bring your creative visions to life.
                 Whether you're seeking a painter to immortalize a cherished memory, a sculptor to breathe life into your space, or any other artistic talent to add a touch of magic to your projects, we've got you covered. Our easy-to-use booking system and diverse range of artists make finding the perfect match for your artistic needs effortless.
                  We empower artists and photographers to showcase their talents and connect with potential clients effortlessly.
                   By posting your work online, you create a vibrant portfolio that attracts clients who can explore your profile and book your services directly. 


                </p>
                <p className="text-lg leading-normal opacity-75 ">
                At Bid or Book, we offer a unique auction feature exclusively for our community of artists and photographers.
                 This allows them to set up their works for auction, providing an exciting opportunity for clients to bid on their favorite pieces.
                  Clients can participate in the auction process, with the highest bid securing the artwork.
                   This competitive and engaging feature not only helps artists and photographers showcase their talents but also enables them to reach a broader audience and maximize the value of their creations.
                    Join Bid or Book and experience the thrill of bidding on exceptional artworks while supporting talented artists and photographers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;

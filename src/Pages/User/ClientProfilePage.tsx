import React, { useEffect, useState } from "react";
import { Navbar } from "../../Components/User/Navbar";
import {  useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";
import ProfileForm from "../../Components/User/ProfileForm";
const ClientProfilePage: React.FC = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize:any = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [activeSection, setActiveSection] = useState("profile");
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };
  return (
    <>
      <Navbar />
      <main className="profile-page h-screen ">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: "url('src/assets/ClientProfile1.jpeg')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: "url('src/assets/ClientProfile1.jpeg')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
        </section>
        <section
          className="relative py-16 bg-blueGray-200 bg-center bg-cover flex-grow"
          style={{ backgroundImage: "url(/src/assets/ClientProfile2.jpeg)" }}
        >
          <div className="container mx-auto px-4">
            <div
              className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
              style={{ opacity: "0.85" }}
            >
              <div className="px-6">
                <div className="flex flex-wrap justify-center ">
                  <div className="w-full lg:w-3/12  mb-5 px-4 lg:order-2 flex justify-center py-7">
                    <div className="relative">
                      {!userInfo.data.message.profile ? (
                        <img
                          alt="..."
                          src="src/assets/dummy_profile.jpg"
                          className="shadow-xl rounded-full h-auto align-middle border-none -m-16 -ml-20 lg:-ml-16 max-w-150-px object-cover"
                        />
                      ) : (
                        <img
                          src={userInfo.data.message.profile}
                          alt="Profile"
                          className="shadow-xl rounded-full h-auto align-middle border-none -m-16 -ml-20 lg:-ml-16 max-w-150-px object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-16">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {userInfo?.data?.message?.Fname}
                  </h3>
                </div>
                
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
  <div className="flex flex-wrap justify-evenly">
  <div className={`rounded-r-xl overflow-hidden bg-gray-200 ${screenWidth <= 1020 ? 'flex flex-row w-full' : 'flex flex-col w-1/4'}`}>
      <ul className={`flex ${window.innerWidth <= 1020 ? 'flex-row' : 'flex-col'} py-4`}>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "profile"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("profile")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-home"></i>
            </span>
            <span className="text-sm font-medium">Profile</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "address"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("address")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-shopping-bag"></i>
            </span>
            <span className="text-sm font-medium">Address</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "bids"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("bids")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-drink"></i>
            </span>
            <span className="text-sm font-medium">
              Your Bids
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "marked"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("marked")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-shopping-bag"></i>
            </span>
            <span className="text-sm font-medium">Marked</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "purchased"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("purchased")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-chat"></i>
            </span>
            <span className="text-sm font-medium">
              Purchased
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "booked"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("booked")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-user"></i>
            </span>
            <span className="text-sm font-medium">Booked</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "chats"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("chats")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-bell"></i>
            </span>
            <span className="text-sm font-medium">Chats</span>
            <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">
              5
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
              activeSection === "logout"
                ? "text-gray-800 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => handleSectionClick("logout")}
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <i className="bx bx-log-out"></i>
            </span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </li>
      </ul>
    </div>

    {activeSection == "profile" && <ProfileForm />}
  </div>
</div>

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ClientProfilePage;

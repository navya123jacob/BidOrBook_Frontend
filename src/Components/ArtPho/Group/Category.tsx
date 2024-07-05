import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/slices/Reducers/types";
import { Link } from "react-router-dom";
import Footer from "../../User/Footer";
import { useAllpostMutation } from "../../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { useFindAvailablePeopleMutation } from "../../../redux/slices/Api/EndPoints/bookingEndpoints";
import Slider from "@mui/material/Slider";
import { useGetEventsQuery } from "../../../redux/slices/Api/EndPoints/AdminEndpoints";
import { IEvent } from "../../../types/Event";
interface Post {
  image: string;
  description: string;
  name: string;
  is_blocked: boolean;
}

interface User {
  profile: string;
  posts: Post[];
  description: string;
  Fname: string;
  Lname: string;
  _id: string;
  minPayPerHour: number;
  typesOfEvents: string[];
}

interface GallerySectionProps {
  onTranslateUp: (category: "Photographer" | "Artist" | null) => void;
  translateUp: "Photographer" | "Artist" | null;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  onTranslateUp,
  translateUp,
}) => {
  const filterType = translateUp;
  const { data: eventsData = [] } = useGetEventsQuery(filterType??'Photographer');
  const [usersWithPosts, setUsersWithPosts] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string>("");
  const [allpost, { isLoading: allPostLoading }] = useAllpostMutation();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [findAvailablePeople, { isLoading: availablePeopleLoading }] =
    useFindAvailablePeopleMutation();

  const ITEMS_PER_PAGE = 2;

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formdata: {
          category: "Photographer" | "Artist" | null;
          usernotid?: string;
          searchPlaceholder?: string;
        } = {
          category: translateUp,
          usernotid: userInfo?.data?.message?._id,
        };

        if (searchPlaceholder) {
          formdata.searchPlaceholder = searchPlaceholder;
        }
        const response = await allpost(formdata).unwrap();
        const filteredPosts = response.posts.filter(
          (post: Post) => !post.is_blocked
        );
        const filteredUsers = filteredPosts.filter(
          (user: User) =>
            user.minPayPerHour >= priceRange[0] &&
            user.minPayPerHour <= priceRange[1] &&
            (selectedEventTypes.length === 0 ||
              user.typesOfEvents.some((eventType) =>
                selectedEventTypes.includes(eventType)
              ))
        );
        setUsersWithPosts(filteredUsers);
        setTotalPages(Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    userInfo,
    translateUp,
    searchPlaceholder,
    priceRange,
    selectedEventTypes,
  ]);


  const handleBackButtonClick = () => {
    onTranslateUp(null);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const today = new Date(Date.now())
    let startDate1=new Date(startDate )
    let endDate1=new Date(endDate )
    if (startDate1 < today || endDate1 < today) {
      setDateError("Dates should be greater than or equal to today's date.");
      return;
    }
    if (endDate1 < startDate1) {
      setDateError("End date should be greater than or equal to start date.");
      return;
    }

    setDateError("");
    try {
      const response = await findAvailablePeople({
        startDate,
        endDate,
        category: translateUp,
        usernotid: userInfo?.data?.message?._id,
      }).unwrap();
      const filteredUsers = response.filter((user: User) =>
        user.posts.some((post: Post) => !post.is_blocked)
      );
      setUsersWithPosts(filteredUsers);
      setTotalPages(Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching available people:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    console.log(event)
    setPriceRange(newValue as number[]);
  };

  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setSelectedEventTypes((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((eventType) => eventType !== value)
    );
  };

  const paginatedUsers = usersWithPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="relative min-h-screen mt-10 bg-black overflow-y-auto transform translate-y-0 transition-transform duration-300">
        <div className="container mx-auto py-12">
          <section className="w-full mb-4">
            <div className="w-full h-[200px] bg-transparent flex flex-col justify-between items-center">
              <div className="flex flex-col justify-center items-center mt-10">
                <button
                  className="focus:outline-none px-4 py-2 rounded-md text-gray-800"
                  onClick={handleBackButtonClick}
                >
                  <img
                    width="48"
                    height="48"
                    src="https://img.icons8.com/pulsar-line/48/FFFFFF/circled-left-2.png"
                    alt="circled-left-2"
                  />
                </button>
                <h1
                  className="text-white text-center xl:text-3xl lg:text-2xl md:text-xl sm:text-l xs:text-base bg-gray-900 p-2 bg-opacity-40 rounded-sm"
                  style={{ fontFamily: "cursive" }}
                >
                  Discover {translateUp}
                </h1>
              </div>
              <div className="w-full mx-auto mb-10">
                <form onSubmit={handleSearch}>
                  <div className="xl:w-1/3 lg:w-1/3 md:w-1/3 sm:w-1/2 xs:w-2/3 mx-auto flex gap-2">
                    <input
                      type="text"
                      className="border border-gray-400 w-full p-1 bg-transparent rounded-md text-base pl-2 text-white"
                      placeholder={`Search for ${translateUp} by name, district, state, or country...`}
                      value={searchPlaceholder}
                      onChange={(e) => setSearchPlaceholder(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <div>
                      <input
                        type="date"
                        className="border border-gray-400 p-1 bg-transparent rounded-md text-base pl-2 text-white"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <input
                        type="date"
                        className="border border-gray-400 p-1 bg-transparent rounded-md text-base pl-2 text-white"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                       {dateError && <p className="text-red-500">{dateError}</p>}
                      <button
                        type="submit"
                        className="focus:outline-none px-4  m-3 py-2 rounded-md text-gray-800 bg-white mt-2"
                      >
                        Search
                      </button>
                    </div>
                    <div className="w-64 ">
                      <p className="text-white text-sm">price range</p>
                      <Slider
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10000}
                        step={100}
                      />
                    </div>
                    <div className="flex flex-wrap">
  {events.map((event) => (
    <label key={event._id} className="inline-flex text-white items-center m-2">
      <input
        type="checkbox"
        value={event.name}
        checked={selectedEventTypes.includes(event.name)}
        onChange={handleEventTypeChange}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
      <span className="ml-2 text-gray-300">{event.name}</span>
    </label>
  ))}
</div>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <div className="relative w-full mt-48">
            {allPostLoading ||
            availablePeopleLoading ||
            usersWithPosts.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                {allPostLoading || availablePeopleLoading ? (
                  <span className="loader"></span>
                ) : (
                  <div>
                    <h2 className="text-white text-xl">
                      NO {translateUp} Found
                    </h2>
                  </div>
                )}
              </div>
            ) : (
              paginatedUsers.map((user, index) => (
                <div
                  key={index}
                  className="max-w-screen-xl bg-opacity-20 bg-white p-5 mx-auto mb-5"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-0 lg:grid-rows-2">
                    <Link
                      className="relative flex items-end justify-start w-full text-left bg-center bg-cover cursor-pointer h-60 md:col-span-2 lg:row-span-2 lg:h-full group"
                      style={{ backgroundImage: `url(${user.profile})` }}
                      to={`/artprof/client?id=${user._id}`}
                    >
                      <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                        <Link
                          rel="noopener noreferrer"
                          to={`/artprof/client?id=${user._id}`}
                          className="px-3 py-2 text-s font-bold tracking-wider uppercase hover:underline"
                        >
                          {user?.Fname} {user?.Lname}
                        </Link>
                        <p className="text-white bg-black p-1 rounded-md">
                          min : ₹ {user.minPayPerHour}/hr
                        </p>
                      </div>
                      <h2 className="z-10 p-5">
                        <Link
                          rel="noopener noreferrer"
                          to={`/artprof/client?id=${user._id}`}
                          className="font-medium text-md lg:text-2xl lg:font-semibold bg-black text-white bg-opacity-50"
                        >
                          {user?.description}
                        </Link>
                      </h2>
                    </Link>
                    {user.posts.slice(0, 4).map((post, postIndex) => (
                      <div
                        key={postIndex}
                        className="relative flex items-end justify-start w-full text-left bg-center bg-cover cursor-pointer h-60 group"
                        style={{ backgroundImage: `url(${post.image})` }}
                      >
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                          <Link
                            rel="noopener noreferrer"
                            to={`/artprof/client?id=${user._id}`}
                            className="px-3 py-2 text-xs font-bold tracking-wider uppercase hover:underline dark:text-gray-800"
                          >
                            {post?.name}
                          </Link>
                        </div>
                        <h2 className="z-10 p-5">
                          <Link
                            rel="noopener noreferrer"
                            to={`/artprof/client?id=${user._id}`}
                            className="font-medium text-md text-white"
                          >
                            {post?.description}
                          </Link>
                        </h2>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
                } mx-1 px-3 py-1 rounded`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GallerySection;

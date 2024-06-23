import React, { Dispatch, SetStateAction, useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import {
  useCheckavailabilityMutation,
  useMakeBookingreqMutation,
} from "../../redux/slices/Api/EndPoints/bookingEndpoints";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";
import { Booking } from "../../types/booking";

interface DatePickerModalProps {
  onClose: () => void;
  value: {
    startDate: Date | string;
    endDate: Date | string;
  };
  handleValueChange: (newValue: DateValueType | null) => void;
  artistId: string | undefined;
  setSingle: React.Dispatch<React.SetStateAction<Booking | null>>;
  category: string;
  setChanges?: Dispatch<SetStateAction<number>>;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  onClose,
  value,
  handleValueChange,
  artistId,
  category,
  setSingle,
  setChanges
}) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [makeBookingreq, { isLoading: req }] = useMakeBookingreqMutation();
  const [checkAvailability, { isLoading: check }] =
    useCheckavailabilityMutation();
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null
  );
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [formData, setFormData] = useState({
    event: "",
    location: {
      district: "",
      state: "",
      country: "",
    },
  });
  const [errors, setErrors] = useState({
    event: "",
    district: "",
    state: "",
    country: "",
  });
  const [dateErrorMessage, setDateErrorMessage] = useState<string | null>(null);
const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.event) newErrors.event = "Event is required";
    if (!formData.location.district)
      newErrors.district = "District is required";
    if (!formData.location.state) newErrors.state = "State is required";
    if (!formData.location.country) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDates = () => {
    const today = new Date();
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);
  
    if (startDate <= today || endDate <= today) {
      setDateErrorMessage("Please select dates after today.");
      setIsSubmitDisabled(true);
      return false;
    }
    setDateErrorMessage(null);
    setIsSubmitDisabled(false);
    return true;
  };

  const handleCheckAvailability = async () => {
    const startDate = new Date(value.startDate);
  const endDate = new Date(value.endDate);
  
  if (!validateDates()) return;

    if (!validateForm()) return;


    const dates = {
      artistId: artistId,
      bookingId:'',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const response: string[] = await checkAvailability(dates).unwrap();
console.log(response)
      const filteredDates: any = response.filter((date) => {
        const dateObj = new Date(date);
        return dateObj >= startDate && dateObj <= endDate;
      });

      setUnavailableDates(filteredDates);

      const totalDays =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      if (filteredDates.length === totalDays) {
        setAvailabilityMessage("No slots are available");
      } else {
        setAvailabilityMessage(
          "Red Slots are unavailable\nBlue Slots are available"
        );
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  const handleRequestBooking = async () => {
    if (!validateForm()) return;

    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    const totalDays =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    if (unavailableDates.length === totalDays) {
      console.log("no");
      return;
    }

    const datesInRange: Date[] = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (
        !unavailableDates.some(
          (date) => new Date(date).toDateString() === currentDate.toDateString()
        )
      ) {
        datesInRange.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (datesInRange.length > 0) {
      const requestData = {
        artistId: artistId,
        clientId: userInfo?.data?.message?._id,
        dates: datesInRange,
        marked: false,
        event: formData.event,
        location: {
          district: formData.location.district,
          state: formData.location.state,
          country: formData.location.country,
        },
        amount:0
      };
      const response = await makeBookingreq(requestData);

      if ("data" in response) {
        setSingle(response.data);
        onClose();
      } else {
        setAvailabilityMessage("Error");
        onClose();
      }
    }
  };

  const handleMark = async () => {
    if (!validateForm()) return;

    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    const datesInRange: Date[] = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      datesInRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }


    if (datesInRange.length > 0) {
      const markData = {
        artistId: artistId,
        clientId: userInfo?.data?.message?._id,
        dates: datesInRange,
        marked: true,
        event: formData.event,
        location: {
          district: formData.location.district,
          state: formData.location.state,
          country: formData.location.country,
        },
      };
      const response = await makeBookingreq(markData);

      if ("data" in response) {
        setSingle(response.data);
        onClose();
      } else {
        setAvailabilityMessage("Error");
        onClose();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-75 p-4 rounded-lg max-w-lg mx-auto text-gray-800 relative">
        {!availabilityMessage && (
          <div className="p-4">
            <Datepicker  value={value} onChange={handleValueChange} />
            {dateErrorMessage && (
            <div className="text-red-500 mb-2">{dateErrorMessage}</div>
          )}
            <div>
              <label>
                Event:
                <input
                  type="text"
                  name="event"
                  value={formData.event}
                  onChange={handleInputChange}
                  className="block border border-gray-300 rounded p-2 w-full"
                />
                {errors.event && (
                  <span className="text-red-500">{errors.event}</span>
                )}
              </label>
            </div>
            <div>
              <label>
                District:
                <input
                  type="text"
                  name="district"
                  value={formData.location.district}
                  onChange={handleLocationChange}
                  className="block border border-gray-300 rounded p-2 w-full"
                />
                {errors.district && (
                  <span className="text-red-500">{errors.district}</span>
                )}
              </label>
            </div>
            <div>
              <label>
                State:
                <input
                  type="text"
                  name="state"
                  value={formData.location.state}
                  onChange={handleLocationChange}
                  className="block border border-gray-300 rounded p-2 w-full"
                />
                {errors.state && (
                  <span className="text-red-500">{errors.state}</span>
                )}
              </label>
            </div>
            <div>
              <label>
                Country:
                <input
                  type="text"
                  name="country"
                  value={formData.location.country}
                  onChange={handleLocationChange}
                  className="block border border-gray-300 rounded p-2 w-full"
                />
                {errors.country && (
                  <span className="text-red-500">{errors.country}</span>
                )}
              </label>
            </div>
          </div>
        )}
        {availabilityMessage && (
          <>
            <button
              onClick={() => {
                setAvailabilityMessage("");
              }}
            >
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </button>
            <div className="p-4">
              <DatePicker
                selected={null}
                onChange={() => {}}
                disabled
                startDate={new Date(value.startDate)}
                endDate={new Date(value.endDate)}
                inline
                dayClassName={(date) => {
                  const currentDate = new Date(date);
                  const today = new Date();
                  const isDateBeforeToday = currentDate < today;

                  const isUnavailable =
                    isDateBeforeToday ||
                    unavailableDates.some(
                      (unavailableDate) =>
                        currentDate.toDateString() ===
                        new Date(unavailableDate).toDateString()
                    );

                  return isUnavailable
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : "";
                }}
                selectsStart
              />
            </div>
            <div className="mt-4 text-center">
              {availabilityMessage !== "No slots are available" ? (
                <button
                  onClick={handleRequestBooking}
                  className={`${
                    req ? "bg-green-600" : "bg-green-700"
                  } hover:bg-green-700 text-white py-2 px-4 rounded`}
                  disabled={isSubmitDisabled}
                >
                  {req ? "Requesting..." : "Request Booking"}
                </button>
              ) : (
                <button
                  onClick={handleMark}
                  className={`${
                    req ? "bg-green-600" : "bg-green-700"
                  } hover:bg-green-700 text-white py-2 px-4 rounded`}
                  disabled={isSubmitDisabled}
                >
                  {req ? "Marking..." : "Mark Artist"}
                </button>
              )}
            </div>
          </>
        )}
        <div className="mt-4 text-center">
          {!availabilityMessage && (
            <button
              onClick={handleCheckAvailability}
              className={`${
                check ? "bg-green-800" : "bg-graydark"
              } hover:bg-gray-700 text-white py-2 px-4 rounded`}
            >
              {check ? "Checking..." : "Check Availability"}
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-4  bg-form-strokedark hover:bg-graydark text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
        {availabilityMessage && (
          <div className="mt-4 text-center">
            <span className="text-red-700">
              {availabilityMessage.split("\n")[0]}
            </span>
            <br />
            <span className="text-blue-700">
              {availabilityMessage.split("\n")[1]}
            </span>
            {availabilityMessage === "No slots are available" && (
              <span className="text-gray-700">
                You can mark for later.
                <br />
                The {category} will notify you <br /> if they are free on these
                dates.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerModal;

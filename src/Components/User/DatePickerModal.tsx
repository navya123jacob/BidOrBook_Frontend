import React, { useEffect, useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import {
  useCheckavailabilityMutation,
  useMakeBookingreqMutation,
} from "../../redux/slices/Api/EndPoints/bookingEndpoints";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";

interface DatePickerModalProps {
  onClose: () => void;
  value: {
    startDate: Date | string;
    endDate: Date | string;
  };
  handleValueChange: (newValue: DateValueType | null) => void;
  artistId: string | undefined;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  onClose,
  value,
  handleValueChange,
  artistId,
}) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [makeBookingreq, { isLoading: req }] = useMakeBookingreqMutation();
  const [checkAvailability, { isLoading: check }] =
    useCheckavailabilityMutation();
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null
  );
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleCheckAvailability = async () => {
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    const dates = {
      artistId: artistId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const response: string[] = await checkAvailability(dates).unwrap();

      const filteredDates: any = response.filter((date) => {
        const dateObj = new Date(date);
        return dateObj >= startDate && dateObj <= endDate;
      });

      setUnavailableDates(filteredDates);

      const totalDays =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      if (response.length === totalDays) {
        setAvailabilityMessage("No slots are available");
      } else {
        setAvailabilityMessage("Red Slots are unavailable");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };
  

  const handleRequestBooking = async () => {
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
  
    setSelectedDates(datesInRange);
    console.log(datesInRange);
  
    if (datesInRange.length > 0) {
      const formData = {
        artistId: artistId,
        clientId: userInfo?.data?.message?._id,
        dates: datesInRange,
      };
      const response = await makeBookingreq(formData);
      
      if ("data" in response) {
        onClose()
      }
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-75 p-4 rounded-lg max-w-lg mx-auto text-gray-800 relative">
        {!availabilityMessage && (
          <div className="p-4">
            <Datepicker value={value} onChange={handleValueChange} />
          </div>
        )}
        {availabilityMessage && (
          <>
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
              <button
                onClick={handleRequestBooking}
                className={`${
                  req ? "bg-green-600" : "bg-green-700"
                } hover:bg-green-700 text-white py-2 px-4 rounded`}
              >
                {req ? "Requesting..." : "Request Booking"}
              </button>
            </div>
          </>
        )}
        <div className="mt-4 text-center">
          {!availabilityMessage && (
            <button
              onClick={handleCheckAvailability}
              className={`${
                check ? "bg-gray-100" : "bg-gray-700"
              } hover:bg-gray-700 text-white py-2 px-4 rounded`}
            >
              {check ? "Checking..." : "Check Availability"}
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-4 bg-gray-700 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
        {availabilityMessage && (
          <div className="mt-4 text-center text-green-700">
            {availabilityMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerModal;

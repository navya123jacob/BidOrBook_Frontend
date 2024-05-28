import React, { useState, useEffect } from 'react';
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useCheckavailabilityMutation } from '../../redux/slices/Api/Client/clientApiEndPoints';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerModalProps {
  onClose: () => void;
  value: {
    startDate: Date | string;
    endDate: Date | string;
  };
  handleValueChange: (newValue: DateValueType | null) => void;
  artistId: string | undefined;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ onClose, value, handleValueChange, artistId }) => {
  const [checkAvailability] = useCheckavailabilityMutation();
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [dates, setDates] = useState<(Date | null)[]>([]);
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);
  const [color, setColor] = useState<number>(0); // Added color state

  const handleCheckAvailability = async () => {
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    const dates = {
      artistId: artistId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const response = await checkAvailability(dates).unwrap();
      const unavailableDates = response.map((date: string) => new Date(date));
      setDates(unavailableDates);

      const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (response.length === totalDays) {
        setAvailabilityMessage('No available slots');
      } else if (response.length === 0) {
        setAvailabilityMessage('All slots are available');
      } else {
        setAvailabilityMessage(`Unavailable slots: ${response.join(', ')}`);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleSingleDateChange = (dates: [Date | null, Date | null]) => {
    setSelectedRange(dates);
    setColor(prevColor => prevColor + 1); 
    const [startDate, endDate] = dates;

    if (startDate && dates.some(unavailableDate => unavailableDate && unavailableDate.toDateString() === startDate.toDateString())) {
      setAvailabilityMessage('Start date is already booked');
    } else if (endDate && dates.some(unavailableDate => unavailableDate && unavailableDate.toDateString() === endDate.toDateString())) {
      setAvailabilityMessage('End date is already booked');
    } else {
      setAvailabilityMessage('Request Booking');
    }
  };

  const handleRequestBooking = () => {
    if (selectedRange[0]) {
      console.log('Request booking for date:', selectedRange[0]);
      // Implement booking request logic here
    }
  };

  const highlightWithRanges = [
    {
      "react-datepicker__day--highlighted-custom-1": dates.filter(date => date !== null) as Date[]
    }
  ];

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
                key={color} // Added key to force re-render
                selected={selectedRange[0]}
                onChange={handleSingleDateChange}
                startDate={new Date(value.startDate)}
                endDate={new Date(value.endDate)}
                highlightDates={highlightWithRanges}
                inline
                dayClassName={date =>
                  dates.some(unavailableDate => unavailableDate && unavailableDate.toDateString() === date.toDateString())
                    ? "bg-red-500 text-white"
                    : selectedRange[0] && date.toDateString() === (selectedRange[0]?.toDateString())
                    ? "bg-green-500 text-white"
                    : selectedRange[1] && date.toDateString() === (selectedRange[1]?.toDateString())
                    ? "bg-green-500 text-white"
                    : ""
                }
                selectsRange
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={handleRequestBooking}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                Request Booking
              </button>
            </div>
          </>
        )}
        <div className="mt-4 text-center">
          {!availabilityMessage && (
            <button onClick={handleCheckAvailability} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
              Check Availability
            </button>
          )}
          <button onClick={onClose} className="ml-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
            Close
          </button>
        </div>
        {availabilityMessage && (
          <div className="mt-4 text-center text-green-700">{availabilityMessage}</div>
        )}
      </div>
    </div>
  );
};

export default DatePickerModal;

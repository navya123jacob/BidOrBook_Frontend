import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Booking } from "../../types/booking";
import { User } from "../../types/user";
import Datepicker from "react-tailwindcss-datepicker";
import { useCheckavailabilityMutation, useUpdatebookingMutation } from "../../redux/slices/Api/EndPoints/bookingEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";


interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  setChanges: Dispatch<SetStateAction<number>>;
  
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  booking,
  setChanges,
 
}) => {
 
  const [updatebooking] = useUpdatebookingMutation();
  const [checkAvailability] = useCheckavailabilityMutation();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  });
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  });
  const [formData, setFormData] = useState({
    _id: '',
    status: "pending",
    clientId: {} as User,
    date_of_booking: [] as Date[],
    location: {
      state: "",
      district: "",
      country: "",
    },
    event: "",
    payment_method: "",
  });

  const [errors, setErrors] = useState({
    event: "",
    location: {
      state: "",
      district: "",
      country: "",
    },
  });
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setFormData({
        _id: booking._id,
        status: booking.status,
        clientId: booking.clientId,
        date_of_booking: booking.date_of_booking,
        location: {
          state: booking.location.state || "",
          district: booking.location.district || "",
          country: booking.location.country || "",
        },
        event: booking.event || "",
        payment_method: booking.payment_method || "",
      });
    } else {
      setFormData({
        _id: '',
        status: "pending",
        clientId: {} as User,
        date_of_booking: [],
        location: {
          state: "",
          district: "",
          country: "",
        },
        event: "",
        payment_method: "",
      });
    }
  }, [booking]);
  const validateForm = () => {
    const newErrors = {
      event: formData.event ? "" : "Event is required",
      location: {
        state: formData.location.state ? "" : "State is required",
        district: formData.location.district ? "" : "District is required",
        country: formData.location.country ? "" : "Country is required",
      },
    };

    setErrors(newErrors);

    return !(
      newErrors.event ||
      newErrors.location.state ||
      newErrors.location.district ||
      newErrors.location.country
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (!availabilityMessage) {
        try {
          const response = await updatebooking(formData).unwrap();
          
            setChanges(prevChanges => prevChanges + 1);

          onClose();
        } catch (error) {
          console.error("Error updating booking:", error);
        }
      } else {
        handleSpecialSubmit();
      }
    } else {
      console.log("Form has errors and cannot be submitted");
    }
  };

  const handleSpecialSubmit = async () => {
 
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

      const datesInRange: Date[] = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (
          !unavailableDates.some((date) => new Date(date).toDateString() === currentDate.toDateString()) ||
          formData.date_of_booking.some((date) => new Date(date).toDateString() === currentDate.toDateString())
        ) {
          datesInRange.push(new Date(currentDate));
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      if (datesInRange.length > 0) {
        const requestData = {
          _id:formData._id, 
          event:formData.event, 
          location:formData.location,
           date_of_booking:datesInRange
          }

          const response = await updatebooking(requestData).unwrap();
          
            setChanges(prevChanges => prevChanges + 1);

          onClose();
        };


  };

  const excludeDates = formData.date_of_booking.map((date) => new Date(date));

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChangeButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowDatePicker(true);
  };

  const handleValueChange = (newValue: any) => {
    setValue(newValue);
    console.log(newValue);
  };

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    const dates = {
      artistId: userInfo.data.message._id,
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


      setAvailabilityMessage("Red Slots are unavailable\nBlue Slots are available");
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-auto">
  <div className="bg-white bg-opacity-80 p-4 rounded-lg max-w-lg mx-auto text-gray-900 relative">
    <div className="modal-header flex justify-between bg-modal-header rounded-t-lg p-4">
      <h2 className="modal-title text-black">Booking Form</h2>
      <button className="modal-close" onClick={onClose}>
        <i className="fas fa-times text-black"></i>
      </button>
    </div>
    <div className="modal-body bg-modal-body">
          <form onSubmit={handleSubmit}>
            <label>
              Event:
              <input
                type="text"
                placeholder="Enter event name"
                value={formData.event}
                onChange={(e) =>
                  setFormData({ ...formData, event: e.target.value })
                }
                className="block border border-gray-300 rounded p-2 w-full"
              />
              {errors.event && (
                <span className="text-red-500">{errors.event}</span>
              )}
            </label>
            <label>
              State:
              <input
                type="text"
                placeholder="Enter state"
                value={formData.location.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value },
                  })
                }
                className="block border border-gray-300 rounded p-2 w-full"
              />
              {errors.location.state && (
                <span className="text-red-500">{errors.location.state}</span>
              )}
            </label>
            <label>
              District:
              <input
                type="text"
                placeholder="Enter district"
                value={formData.location.district}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      district: e.target.value,
                    },
                  })
                }
                className="block border border-gray-300 rounded p-2 w-full"
              />
              {errors.location.district && (
                <span className="text-red-500">{errors.location.district}</span>
              )}
            </label>
            <label>
              Country:
              <input
                type="text"
                placeholder="Enter country"
                value={formData.location.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value },
                  })
                }
                className="block border border-gray-300 rounded p-2 w-full"
              />
              {errors.location.country && (
                <span className="text-red-500">{errors.location.country}</span>
              )}
            </label>
            {!showDatePicker && (
              <div className="flex-col">
                <label>
                  Date of Booking:
                  <DatePicker
                    selected={formData.date_of_booking[0]}
                    onChange={() => {}}
                    startDate={formData.date_of_booking[0]}
                    endDate={formData.date_of_booking[1]}
                    selectsRange
                    inline
                    excludeDates={excludeDates}
                    className="block w-full border border-gray-300 rounded p-2"
                  />
                </label>
                <button
                  onClick={handleDateChangeButtonClick}
                  className="bg-gray-600 text-white py-2 px-4 rounded mt-4 ml-4"
                >
                  Change Date
                </button>
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
                              new Date(unavailableDate).toDateString() &&
                            !formData.date_of_booking.includes(unavailableDate)
                        );

                      return isUnavailable
                        ? "bg-red-500 text-white cursor-not-allowed"
                        : "";
                    }}
                    selectsStart
                  />
                </div>
              </>
            )}

            {showDatePicker &&   (
              <div className="flex-col">
               {!availabilityMessage &&( <><button
                  onClick={() => {
                    setShowDatePicker(false);
                  }}
                >
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </button>
                <label>Select Date:</label>

                <Datepicker value={value} onChange={handleValueChange} />
                <button
                  className="bg-gray-600 text-white py-2 px-4 rounded mt-4 ml-4"
                  onClick={handleCheckAvailability}
                >
                  Check Availability
                </button></>)}
              </div>
            )}
            {(!showDatePicker || availabilityMessage) && (
              <button
                type="submit"
                className="bg-gray-700 text-white py-2 px-4 rounded mt-4 m-5"
                onClick={handleSpecialSubmit}
              >
            Request Payment
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default BookingFormModal;
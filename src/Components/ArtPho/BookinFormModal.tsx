import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import { Booking } from "../../types/booking";
import { User } from "../../types/user";
import {
  useCheckavailabilityMutation,
  useUpdatebookingMutation,
} from "../../redux/slices/Api/EndPoints/bookingEndpoints";
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
  const [initialunavailableDates, setInitialUnavailableDates] = useState<
    Date[]
  >([]);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [dateerror, setDateError] = useState("");
  const [key, setKey] = useState(0);
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  });
  const [formData, setFormData] = useState({
    _id: "",
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
    amount: 0,
  });

  const [errors, setErrors] = useState({
    event: "",
    location: {
      state: "",
      district: "",
      country: "",
    },
    amount: "",
  });
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null
  );

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
        amount: booking.amount || 0,
      });
    } else {
      setFormData({
        _id: "",
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
        amount: 0,
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
      amount: !formData.amount
        ? "Amount is required"
        : !/^\d+$/.test(formData.amount.toString())
        ? "Amount should contain only digits"
        : formData.amount <= 200
        ? "Amount must be greater than 200"
        : "",
    };

    setErrors(newErrors);
    console.log(newErrors);
    return !(
      newErrors.event ||
      newErrors.location.state ||
      newErrors.location.district ||
      newErrors.location.country ||
      newErrors.amount
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const datesInRange = formData.date_of_booking.filter(
      (date) =>
        !initialunavailableDates.some(
          (unavailableDate) =>
            new Date(date).toDateString() ===
            new Date(unavailableDate).toDateString()
        )
    );

    if (datesInRange.length === 0) {
      console.log("No available dates to book.");
      return;
    }

    const updatedFormData = { ...formData, date_of_booking: datesInRange };

    if (!availabilityMessage) {
      try {
         await updatebooking(updatedFormData).unwrap();
        setChanges((prevChanges) => prevChanges + 1);
        onClose();
      } catch (error) {
        console.error("Error updating booking:", error);
      }
    } else {
      handleSpecialSubmit();
    }
  };

  const handleSpecialSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    const datesInRange: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (
        !unavailableDates.some(
          (date) => new Date(date).toDateString() === currentDate.toDateString()
        ) ||
        formData.date_of_booking.some(
          (date) => new Date(date).toDateString() === currentDate.toDateString()
        )
      ) {
        datesInRange.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (datesInRange.length === 0) {
      console.log("No available dates to book.");
      return;
    }

    const requestData = {
      _id: formData._id,
      event: formData.event,
      location: formData.location,
      date_of_booking: datesInRange,
      amount: formData.amount,
      
    };

    try {
      await updatebooking(requestData).unwrap();
      setChanges((prevChanges) => prevChanges + 1);
      onClose();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const startDate = new Date(formData.date_of_booking[0]);
      const endDate = new Date(
        formData.date_of_booking[formData.date_of_booking.length - 1]
      );

      const dates = {
        artistId: userInfo.data.message._id,
        bookingId: booking?._id,
        startDate: formData.date_of_booking[0],
        endDate: formData.date_of_booking[formData.date_of_booking.length - 1],
      };

      try {
        const response: string[] = await checkAvailability(dates).unwrap();

        const filteredDates: any = response.filter((date) => {
          const dateObj = new Date(date);
          return dateObj >= startDate && dateObj <= endDate;
        });

        setInitialUnavailableDates(filteredDates);
        setKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Error checking availability:", error);
      }
    };

    fetchData();
  }, [formData.date_of_booking, userInfo.data.message._id, booking?._id]);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChangeButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
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
    const today = new Date();

    if (startDate < today || endDate < today) {
      setDateError("Selected dates must be after today.");
      return;
    } else {
      setDateError("");
    }

    const dates = {
      artistId: userInfo.data.message._id,
      bookingId: booking?._id,
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
      setAvailabilityMessage(
        "Red Slots are unavailable\nBlue Slots are available"
      );
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
            <label>
              Payment Amount:
              <input
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                className="block border border-gray-300 rounded p-2 w-full"
              />
              {errors.amount && (
                <span className="text-red-500">{errors.amount}</span>
              )}
            </label>
            {!showDatePicker && (
              <div className="flex-col">
                <label>
                  Date of Booking:
                  <DatePicker
                    key={key}
                    selected={formData.date_of_booking[0]}
                    onChange={() => {}}
                    startDate={formData.date_of_booking[0]}
                    endDate={
                      formData.date_of_booking[
                        formData.date_of_booking.length - 1
                      ]
                    }
                    selectsRange
                    inline
                    dayClassName={(date) => {
                      const currentDate = new Date(date);

                      const isUnavailable = initialunavailableDates.some(
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
                </label>
                <button
                  onClick={handleDateChangeButtonClick}
                  className="bg-form-strokedark text-white py-2 px-4 rounded mt-4 ml-4 "
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
                            new Date(unavailableDate).toDateString()
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

            {showDatePicker && (
              <div className="flex flex-col">
                {!availabilityMessage && (
                  <>
                    <button
                      onClick={() => {
                        setShowDatePicker(false);
                      }}
                    >
                      <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </button>
                    <label>Select Date:</label>
                    <Datepicker value={value} onChange={handleValueChange} />
                    <button
                      className="bg-graydark text-white py-2 px-4 rounded mt-4 ml-4"
                      onClick={handleCheckAvailability}
                    >
                      Check Availability
                    </button>
                    {dateerror && (
                      <span className="text-red-500">{dateerror}</span>
                    )}
                  </>
                )}
              </div>
            )}
            {(!showDatePicker || availabilityMessage) && (
              <button
                type="submit"
                className="bg-graydark text-white py-2 px-4 rounded mt-4 m-5"
                onClick={handleSubmit}
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

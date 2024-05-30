import { User } from "./user";
export interface Address {
    address: string;
    pincode: number;
    state: string;
    district: string;
    country: string;
  }
  
  export type BookingStatus = 'pending' | 'confirmed' | 'marked';
  
  export interface Booking {
    _id: string;
    status: BookingStatus;
    clientId: User;
    artistId: string;
    location: Address;
    event?: string;
    payment_method?: string;
    payment_date?: Date;
    date_of_booking: Date[];
  }
  
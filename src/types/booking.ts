import { User } from "./user";
export interface Address {
    
    state: string;
    district: string;
    country: string;
  }
  
  export type BookingStatus = 'pending' | 'confirmed' | 'marked'|'booked'|'done';
  
  
  export interface Booking {
    _id: string;
    status: BookingStatus;
    clientId: User;
    artistId: User;
    location: Address;
    event?: string;
    payment_method?: string;
    payment_date?: Date;
    date_of_booking: Date[];
    amount:number
  }

 
  
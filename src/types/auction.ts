import { Spam,ISpam, User } from "./user";
export interface IAuction extends Document {
    _id:string;
  name:string;
  description:string;
  userId: string;
  image: string;
  bids: { userId: string; amount: number }[];
  startingdate: Date;
  endingdate: Date;
  status: 'active' | 'inactive';
  initial: number;
  payment:string;
  paymentmethod:string;
  payment_date:Date;
  spam:Spam[]
}
export interface AdIAuction extends Document {
    _id:string;
  name:string;
  description:string;
  userId: User;
  image: string;
  bids: { userId: User; amount: number }[];
  startingdate: Date;
  endingdate: Date;
  status: 'active' | 'inactive';
  initial: number;
  payment:string;
  paymentmethod:string;
  spam:ISpam[]
}

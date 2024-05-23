import { UserType } from './auth';

//STRUKTURA ZA BID TYPE (dodaj User objekt)
export type BidType = {
  id: number;
  createdAt: Date;
  price: number;
  userId: number;
  auctionId: number;
  user: UserType;
};

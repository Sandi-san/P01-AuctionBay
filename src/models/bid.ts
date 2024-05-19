import { UserType } from "./auth"

export type BidType = {
  id: number,
  createdAt: Date,
  price: number,
  status: string,
  userId: number,
  auctionId: number,
  user: UserType,
}

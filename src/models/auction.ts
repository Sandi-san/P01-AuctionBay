export type AuctionType = {
  id: number
  title: string
  description?: string
  currentPrice: number
  status: string
  duration: Date
  image?: string
  userId: number
}

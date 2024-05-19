import { apiRoutes } from '../constants/apiConstants'
import { apiRequest } from './Api'
import { CreateAuctionFields, UpdateAuctionFields } from '../hooks/react-hook-form/useCreateUpdateAuction'
import { BidType } from '../models/bid'
import { CreateBidFields } from '../hooks/react-hook-form/useCreateUpdateBid'

const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token')
  //parsaj access token iz JSON (dobi samo vsebini)
  let parsedAccessToken
  if (accessToken) {
    const parsedToken = JSON.parse(accessToken)
    if (parsedToken && parsedToken.access_token) {
      parsedAccessToken = parsedToken.access_token
      return parsedAccessToken
    }
  }
  return null
}

export const fetchBids = async (auctionId: number) => {
  const response = await apiRequest<undefined, BidType>(
    'get',
    `${apiRoutes.AUCTION_PREFIX}/${auctionId}/${apiRoutes.FETCH_BIDS}`,
    undefined,
  )

  //poglej ce response vsebuje data
  if (response && response.data) {
    return response.data //vrni data
  } else {
    console.error('No bid data found in response')
    return null // return null ce data ni available
  }
}


export const createBid = async (data: CreateBidFields, auctionId: number) => {
  console.log('Create bid data:', JSON.stringify(data))

  const accessToken = getAccessToken()
  return apiRequest<CreateBidFields, void>(
    'post',
    `${apiRoutes.AUCTION_PREFIX}/${auctionId}/${apiRoutes.BID_AUCTION}`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

import { apiRoutes } from '../constants/apiConstants'
import { apiRequest } from './Api'
import { AuctionType } from '../models/auction'
import { CreateAuctionFields, UpdateAuctionFields } from '../hooks/react-hook-form/useCreateUpdateAuction'

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
  const response = await apiRequest<undefined, AuctionType>(
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



export const createBid = async (data: CreateAuctionFields) => {
  console.log('Create auction data:', JSON.stringify(data))

  const accessToken = getAccessToken()
  return apiRequest<CreateAuctionFields, void>(
    'post', 
    apiRoutes.USER_AUCTION_PREFIX, 
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

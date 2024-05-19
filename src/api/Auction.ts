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

export const fetchAuction = async () => {
  //dobi access token (local storage)
  const accessToken = getAccessToken()

  const response = await apiRequest<undefined, AuctionType>(
    'get',
    apiRoutes.AUCTION_PREFIX,
    undefined,
    //POZOR: treba poslati Authorization za access token
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  //poglej ce response vsebuje data
  if (response && response.data) {
    return response.data //vrni data
  } else {
    console.error('No user data found in response')
    return null // return null ce user data is ni available
  }
}

//paginatedAuctions
export const fetchAuctions = async (pageNumber: number) =>
  apiRequest<number, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTION_PREFIX}?page=${pageNumber}`,
  )

export const fetchUserAuctions = async (pageNumber: number) => {
  const accessToken = getAccessToken()
  return apiRequest<number, AuctionType[]>(
    'get',
    `${apiRoutes.USER_AUCTIONS}?page=${pageNumber}`,
    undefined,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export const fetchUserAuctionsWon = async (pageNumber: number) => {
  const accessToken = getAccessToken()
  return apiRequest<number, AuctionType[]>(
    'get',
    `${apiRoutes.USER_AUCTIONS_WON}?page=${pageNumber}`,
    undefined,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export const fetchUserAuctionsBidding = async (pageNumber: number) => {
  const accessToken = getAccessToken()
  return apiRequest<number, AuctionType[]>(
    'get',
    `${apiRoutes.USER_AUCTIONS_BIDDING}?page=${pageNumber}`,
    undefined,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

// export const uploadImage = async (formData: FormData, id: string) =>
//   apiRequest<FormData, void>(
//     'post',
//     `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
//     formData,
//   )

export const createAuction = async (data: CreateAuctionFields) => {
  console.log('Create auction data:', JSON.stringify(data))

  const accessToken = getAccessToken()
  return apiRequest<CreateAuctionFields, void>(
    'post',
    apiRoutes.USER_AUCTION_PREFIX,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export const updateAuction = async (id: number, data: UpdateAuctionFields) => {
  console.log('Update auction data:', JSON.stringify(data))

  const accessToken = getAccessToken()
  return apiRequest<UpdateAuctionFields, void>(
    'patch',
    `${apiRoutes.USER_AUCTION_PREFIX}/${id}`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

//slika se posilja posebej
export const uploadAuctionImage = async (id: number, formData: FormData) => {
  console.log('Auction image:', JSON.stringify(formData))

  const accessToken = getAccessToken()
  return apiRequest<FormData, void>(
    'post',
    `${apiRoutes.USER_AUCTION_PREFIX}/${id}/${apiRoutes.UPLOAD_AUCTION_IMAGE}`,
    formData,
    //POZOR: poslati treba tudi Content-Type
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' } }
  )
}

export const deleteAuction = async (id: number) => {
  const accessToken = getAccessToken()
  return apiRequest<string, AuctionType>(
    'delete',
    `${apiRoutes.AUCTION_PREFIX}/${id}`,
    undefined,
    //POZOR: poslati treba tudi Content-Type
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

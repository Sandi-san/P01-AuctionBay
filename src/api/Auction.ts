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
    apiRoutes.FETCH_AUCTION,
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
// export const fetchAuctions = async (pageNumber: number) =>
//   apiRequest<number, AuctionType[]>(
//     'get',
//     `${apiRoutes.FETCH_AUCTIONS}?page=${pageNumber}`,
//   )

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
    apiRoutes.CREATE_AUCTION, 
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export const uploadImage = async (formData: FormData) => {
  console.log(`Image: ${formData.get('image')}`)
  console.log('Create auction image:', JSON.stringify(formData))

  const accessToken = getAccessToken()
  return apiRequest<FormData, void>(
    'post', 
    apiRoutes.CREATE_AUCTION, 
    formData,
    //POZOR: poslati treba tudi Content-Type
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' } }
  )
}

export const updateAuction = async (data: UpdateAuctionFields) => {
  console.log('Update auction data:', JSON.stringify(data))
  const accessToken = getAccessToken()
  return apiRequest<UpdateAuctionFields, void>(
    'patch',
    `${apiRoutes.UPDATE_AUCTION}`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

// export const deleteAuction = async (id: string) =>
//   apiRequest<string, AuctionType>('delete', `${apiRoutes.USERS_PREFIX}/${id}`)

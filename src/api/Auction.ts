import { apiRoutes } from '../constants/apiConstants';
import { apiRequest } from './Api';
import { AuctionType } from '../models/auction';
import {
  CreateAuctionFields,
  UpdateAuctionFields,
} from '../hooks/react-hook-form/useCreateUpdateAuction';

//dobi local storage access_token od userja
const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  //parsaj access token iz JSON (dobi samo vsebini)
  let parsedAccessToken;
  if (accessToken) {
    const parsedToken = JSON.parse(accessToken);
    if (parsedToken && parsedToken.access_token) {
      parsedAccessToken = parsedToken.access_token;
      return parsedAccessToken;
    }
  }
  return null;
};

//GET Auctions (paginated)
export const fetchAuctions = async (pageNumber: number) =>
  apiRequest<number, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTION_PREFIX}?page=${pageNumber}`,
  );

//GET User Auctions (paginated)
export const fetchUserAuctions = async (pageNumber: number) => {
  //dobi lokalni access_token
  const accessToken = getAccessToken();
  return apiRequest<number, AuctionType[]>(
    'get',
    //route in page number
    `${apiRoutes.USER_AUCTIONS}?page=${pageNumber}`,
    undefined,
    //userjev access_token, ker je route pod guard-om
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

//GET User Won Auctions (paginated)
export const fetchUserAuctionsWon = async (pageNumber: number) => {
  const accessToken = getAccessToken();
  return apiRequest<number, AuctionType[]>(
    'get',
    `${apiRoutes.USER_AUCTIONS_WON}?page=${pageNumber}`,
    undefined,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

//GET User Bidding Auctions (paginated)
export const fetchUserAuctionsBidding = async (pageNumber: number) => {
  const accessToken = getAccessToken();
  return apiRequest<number, AuctionType[]>(
    'get',
    `${apiRoutes.USER_AUCTIONS_BIDDING}?page=${pageNumber}`,
    undefined,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

//POST Create Auction
export const createAuction = async (data: CreateAuctionFields) => {
  console.log('Create auction data:', JSON.stringify(data));

  //dobi access_token za POST
  const accessToken = getAccessToken();
  return apiRequest<CreateAuctionFields, void>(
    //request type
    'post',
    //route
    apiRoutes.USER_AUCTION_PREFIX,
    //data ki posiljamo v api
    data,
    //authentication token (access_token ker route pod guard-om)
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

//PATCH Update Auction
export const updateAuction = async (id: number, data: UpdateAuctionFields) => {
  console.log('Update auction data:', JSON.stringify(data));

  const accessToken = getAccessToken();
  return apiRequest<UpdateAuctionFields, void>(
    'patch',
    `${apiRoutes.USER_AUCTION_PREFIX}/${id}`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

//PATCH Update Auction Image (slika se posilja posebej, ker ne moremo file+data v en api request v backendu)
export const uploadAuctionImage = async (id: number, formData: FormData) => {
  console.log('Auction image:', JSON.stringify(formData));

  const accessToken = getAccessToken();
  return apiRequest<FormData, void>(
    'post',
    `${apiRoutes.USER_AUCTION_PREFIX}/${id}/${apiRoutes.UPLOAD_AUCTION_IMAGE}`,
    formData,
    //POZOR: poslati treba tudi Content-Type
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

//DELETE Auction
export const deleteAuction = async (id: number) => {
  const accessToken = getAccessToken();
  return apiRequest<string, AuctionType>(
    'delete',
    `${apiRoutes.AUCTION_PREFIX}/${id}`,
    undefined,
    //POZOR: poslati treba tudi Content-Type
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

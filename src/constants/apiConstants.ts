export enum apiRoutes {
  //auth
  LOGIN = '/auth/login',
  SIGNUP = '/auth/signup',
  SIGNOUT = '/auth/signout',

  //users
  FETCH_USER = '/me',
  UPDATE_USER_IMAGE = '/me/upload-image',
  UPDATE_USER = '/me/edit',
  UPDATE_USER_PASSWORD = '/me/update-password',
  // FETCH_USERS = '/users',

  USER_AUCTION_PREFIX = '/me/auction',
  USER_AUCTIONS = '/me/auctions',
  USER_AUCTIONS_WON = '/me/auctions/won',
  USER_AUCTIONS_BIDDING = '/me/auctions/bidding',
  UPLOAD_AUCTION_IMAGE = 'upload-image',
  USER_BIDS = '/me/bids',

  //auctions
  AUCTION_PREFIX = '/auctions',
  FETCH_BIDS = 'bids',
  BID_AUCTION = 'bid',
}

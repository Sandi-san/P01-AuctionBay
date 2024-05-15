export enum apiRoutes {
  //auth
  LOGIN = '/auth/login',
  SIGNUP = '/auth/signup',
  SIGNOUT = '/auth/signout',
  // REFRESH_TOKENS = '/auth/refresh',

  //users
  FETCH_USER = '/me',
  UPDATE_USER_IMAGE = '/me/upload-image',
  UPDATE_USER = '/me/edit',
  UPDATE_USER_PASSWORD = '/me/update-password',
  // FETCH_USERS = '/users',

  USER_AUCTION_PREFIX = '/me/auction',
  USER_AUCTIONS = '/me/auctions',
  // CREATE_AUCTION = '/me/auction',
  UPLOAD_AUCTION_IMAGE = 'upload-image',
  // UPDATE_AUCTION = '/me/auction/:id',
  USER_BIDS = '/me/bids',
  USER_BIDS_WON = '/me/bids/won',

  //auctions
  AUCTION_PREFIX = '/auctions',
  // FETCH_AUCTION = '/auctions/:id',
  FETCH_BIDS = 'bids',
  BID_AUCTION = 'bid',

  // UPLOAD_AVATAR_IMAGE = '/users/upload',
  // UPLOAD_PRODUCT_IMAGE = '/products/upload',
  // GET_AVATAR_IMAGE = '/users/get/image',
  // PRODUCTS_PREFIX = '/products',
  // ROLES_PREFIX = '/roles',
  // ORDERS_PREFIX = '/orders',
  // PERMISSIONS_PREFIX = '/permissions',
}

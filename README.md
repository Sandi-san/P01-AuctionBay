# AUCTIONBAY

<img alt="image" src="https://c1india.com/wp-content/uploads/2020/05/Bidding-process.jpg" width="600px" /> 

## Description:

AuctionBay is a dynamic full-stack auction web application where users can effortlessly create and manage auction events.<br>
Sellers can showcase their items with images, descriptions, and starting prices, while bidders engage in the purchase of items through incremental bidding until reaching their maximum bid or end duration of an auction.<br>
Bidders can track their bids, and at the end of the auction period, the highest bid secures the item. Sellers have access to comprehensive analytics and bidding histories throughout the auction process.

## Used technologies:
<img alt="image" src="https://brotherants.com/skillupmentor/images/image5.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image7.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image12.png" width="25px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image17.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image4.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image3.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image19.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image1.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image11.png" width="30px" />
<img alt="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9fZzRj7BuQAtuf6RSuqIjWEaai2Vl7sFq2Y6tKq5hA&s" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image2.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image10.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image8.png" width="30px" />
<img alt="image" src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/287/square_480/prismaHD.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image14.png" width="30px" />
<img alt="image" src="https://brotherants.com/skillupmentor/images/image9.png" width="30px" />
<br>

**Backend:**
- Nest.js (application main structure)
- Node (main framework)
- Prisma (interaction with database)
- PostgreSQL (database)
- Argon2 (encryption)
- Express (API handling)
- Jwt (Authentication)

**Frontend:**
- React (application main structure)
- React Bootstrap (bootstrap CSS framework)
- React Dom (DOM element management)
- React Hook Form (form state and validation)
- React Query (fetching server data)
- Axios (API request)
- Mobx (component management)
- Yup (schema definition for forms)
- TailWind (CSS styling)

**Other:**
- JSON (structure of API calls)
- HTML (browser display)
- Figma (frontend design)
- JavaScript, TypeScript (main programming language)
- Git, GitHub (versioning)
- Postman (testing of API calls)

## Installation:

1. Open command prompt in directory where you want to run the project.
2. Download Node Package Manager (NPM): [Node.js](https://nodejs.org/)
3. Clone this repo:
   ```sh
   git clone https://github.com/Sandi-san/P01-AuctionBay.git
4. Navigate to project directory:
    ```sh
   cd P01-AuctionBay
5.	Install project dependencies:
    ```sh
   npm install
6.	Configure project:
    - Create database
    - Create credentials in .env file
    ```sh
    DATABASE_URL="postgresql://postgres:USER@localhost:5432/DB_NAME?schema=public"
    JWT_SECRET="YOUR_JWT_TOKEN"
    
7.	Run the application:
    ```sh
   npm run

## Endpoints

The backend portion of the project consists of API endpoint routes that the frontend portion of the application calls to receive or change data in the database.

The endpoints expect and return requests in JSON format. They consist of three main classes: User, Auction, and Bid. User is split into its own class, User, as well as Auth.

All available endpoint routes are noted below. The **bolded endpoints** require authentication to be accessed: `Authorization: Bearer "{{token}}"`.

### Auth class:

The Auth endpoints return an access token rather than the entire User object for security reasons. The frontend uses the access token to reach authorized endpoints.

- **/auth/signup**

    Signup with a new user profile (first name, last name, **email, password, confirm password**).

- **/auth/login**

    Login as a user (**email, password**).
    
- **/auth/signout**

    Logs out the user and deletes the local access token.


### User class:
- **/me**
    
    Returns the user object of the currently logged user.

- **/me/edit**

    Update the credentials of the current user (first name, last name, email).

- **/me/upload-image**

    Upload and update the profile image of the current user (**file**).

- **/me/update-password**

    Change the password of the current user (**old password, new password, confirm new password**).

- **/me/auction**

    Create a new auction as current user (**title**, description, **current price, duration**, image).

- **/me/auction/:id**

    Update the info of an auction (title, description, duration, image)<br>
    The image is uploaded onto a separate route, that is called if the frontend posts an image file:<br>
    **/me/auction/:id/upload-image** (**file**)

- **/me/auctions**

    Return all auctions created by the current user. Returns paginated result.

- **/me/auctions/won**

    Return all auctions won by the current user. Returns paginated result.

- **/me/auctions/bidding**

    Return all auctions that the current user is bidding on. Returns paginated result.

### Auction class:
- /auctions

    Return all currently running auctions from all users. Returns paginated result.

- /auctions/:id

    Return one auction.

- /auctions/:id/bids

    Return all bids placed on one auction.

- **/auctions/:id/bid**

    Bid on an auction as current user (**price**).

#### Bid class has no defined routes.

## Database scheme:

```graphql
model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  firstName String?
  lastName  String?
  email    String @unique
  password String
  image   String?
  Auction Auction[]
  Bid     Bid[]
  @@map("users")
}

model Auction {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title       String
  description String?
  currentPrice Int
  status       String @default("In progress") //done, in progress
  duration DateTime
  image    String?
  //FOREIGN KEY
  userId Int
  user   User  @relation(fields: [userId], references: [id])
  Bid    Bid[]
  @@map("auctions")
}

model Bid {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  price  Int
  //FOREIGN KEYS
  userId    Int
  user      User    @relation(fields: [userId], references: [id])
  auctionId Int
  auction   Auction @relation(fields: [auctionId], references: [id], onDelete: Cascade)
  @@map("bids")
}
```

**Disclaimer :**

*This assignment is protected with SkillUp Mentor copyright. The Candidate may upload the assignment on his closed profile on GitHub (or other platform), but any other reproduction and distribution of the assignment itself or the assignment&#39;s solutions without written permission of SkillUp Mentor is prohibited.*
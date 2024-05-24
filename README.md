# AUCTIONBAY

<img alt="image" src="https://c1india.com/wp-content/uploads/2020/05/Bidding-process.jpg" width="600px" /> 

## Description:

AuctionBay is a dynamic full-stack auction web application where users can effortlessly create and manage auction events.<br>
Sellers can showcase their items with images, descriptions, and starting prices, while bidders engage in the purchase of items through incremental bidding until reaching their maximum bid or end duration of an auction.<br>
Bidders can track their bids, and at the end of the auction period, the highest bid secures the item. Sellers have access to comprehensive analytics and bidding histories throughout the auction process.

## Used technologies:
<img alt="image" src="https://brotherants.com/skillupmentor/images/image5.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image7.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image12.png" width="25px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image17.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image4.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image3.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image19.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image1.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image11.png" width="30px" /> <img alt="image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9fZzRj7BuQAtuf6RSuqIjWEaai2Vl7sFq2Y6tKq5hA&s" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image2.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image10.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image8.png" width="30px" /> <img alt="image" src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/287/square_480/prismaHD.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image14.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image9.png" width="30px" />
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
  - Create credentials in .env file
    ```sh
    REACT_APP_API_URL="DOMAIN_AND_PORT_OF_YOUR_BACKEND"
7.	Run the application:
    ```sh
    npm run

# Overview

## Design

The layout of the frontend was styled after the [Figma design](https://www.figma.com/file/uDZgkwfYXsrf90uDlqp7Iu/ahub?type=design&node-id=0-1&mode=design).

<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/A1.png" width="30px" /><br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/A2.png" width="30px" />

## Structure

The frontend is split into three main areas, same as in the Figma design:
    
- Landing page (Home, Login, Signup)

- Auction (All auctions, One auction)

- Profile (My auctions, Bidding auctions, Won auctions)

### Landing pages:

**Home:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/B1.png" width="30px" /><br>
The home page is the main page of the application where a new user can choose to sign up into the service, or already start browsing auctions from other users without needing to log in.

**Signup:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/B2.png" width="30px" /><br>
The page where a new user will input their credentials. First and last name are optional, but a user must provide an email and password.

**Login:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/B3.png" width="30px" /><br>
After signing up, the user can use their new created credentials to log into the site and use all its features.

### Auction pages:

**Auctions:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/C1.png" width="30px" /><br>
The page where all currently running auctions from all users are displayed. To prevent heavy resource intensiveness, only a few auctions are displayed at a time. More auctions can be viewed by browsing the pages.

**Auction:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/C5.png" width="30px" /><br>
The page where you can view the full details of an auction item and also the latest bids placed on said item. Logged users can also bid on the item.

### Profile pages:

**My auctions:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/C2.png" width="30px" /><br>
These pages are only available to logged users and are separated in tabs. This tab displays all auctions created by the current user.

**Bidding:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/C3.png" width="30px" /><br>
This tab shows the auctions where the user has placed a bid and the auction is still ongoing.

**Won:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/C4.png" width="30px" /><br>
This tab shows all the auctions the user has won in the past.

### Popups and other forms:

**Add auction:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/D2.png" width="30px" /><br>
The logged user can create a new auction that other users can bid on.

**Edit auction:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/D1.png" width="30px" /><br>
The logged user can edit the details of their own auction.

**Profile settings:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/D3.png" width="30px" /><br>
The logged user can change their credentials; their first and last name, as well as their email.

**Profile password:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/D4.png" width="30px" /><br>
The logged user can change their password.

**Profile image:**<br>
<img alt="image" src="https://github.com/Sandi-san/P01-AuctionBay/raw/frontend-main/public/readme_images/D5.png" width="30px" /><br>
The logged user can add or change their profile image, which is used for their recognition on the site.

**Disclaimer :**

*This assignment is protected with SkillUp Mentor copyright. The Candidate may upload the assignment on his closed profile on GitHub (or other platform), but any other reproduction and distribution of the assignment itself or the assignment&#39;s solutions without written permission of SkillUp Mentor is prohibited.*

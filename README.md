# AUCTIONBAY

<img alt="image" src="https://c1india.com/wp-content/uploads/2020/05/Bidding-process.jpg" width="600px" /> 

**Short description** :

Build a Full-stack auction web application that enables users to create and manage events for auctions. Registered users can create auction events by providing images, event titles, descriptions, starting prices, and auction durations. Bidders can participate in auctions, place bids, and view the status of their bids. Bids are incrementally increased until reaching the user's specified maximum bid. The highest bid at the end of the auction period wins the item. Sellers can manage their auction events and view bidding histories.


**Technologies you will use** :

Html, Css, Figma, JavaScript, Typescript, Node, NestJS, Express, React, Docker, AWS, Git, GitHub, PostgreSQL, Prisma, JWT, Postman, Trello

<img alt="image" src="https://brotherants.com/skillupmentor/images/image5.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image7.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image12.png" width="25px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image17.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image4.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image3.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image19.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image1.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image11.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image18.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image16.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image2.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image10.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image8.png" width="30px" /> <img alt="image" src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/287/square_480/prismaHD.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image14.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image9.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image13.png" width="30px" /> 

**Pre-requirements** :

- GitHub account
- Trello account
- AWS account
- Figma account
- Local PostgreSQL

**Prepared** :

- Figma design and UX for frontend
- Trello template for managing tasks

**Use** :

- The latest stable Node
- **Typescript**
- For DBMS use PostgreSQL
- Latest stable NestJS with Express.js framework (**Typescript**)
- Git &amp; GitHub (create separate Git for backend and frontend)
- Latest stable ReactJS for frontend (with **TypeScript** )
- Postman for testing API
- Use local storage for images.
- Use DB migrations (NestJS has great way for this).


**Required functionality** :

- JWT token authentication
- JSON server responses
- Figma pixel perfect design
- Deploy the application to an online service of your choice (Heroku, Netlify, AWS …).
- **Think about security issues that can emerge (https://owasp.org/www-project-top-ten).**
- In frontend prepare a section for all feedback error messages (use state management).
- Use .ENV for database credentials (security).

**Don&#39;t forget** :

- Prepare Readme.md to describe the application in GitHub.
- Maintain a consistent code style (Usage of linters/prettifiers is recommended).
- Divide the tasks in Trello according to the instructions. For each task estimated time (in hours) for completing the task.
- Branch each task in Github (GitFlow).
- For design use CSS or Styled components.

**Bonus** :

- Docker (for backend)
  - For local environment configuration (database, env vars, ...)
  - Dockerfile for building a docker image from the application code

- Deploy backend Docker Container on AWS
- Deploy frontend on AWS S3

- Image storage on AWS S3.

- Buld Frontend in NextJS.

- Implement an automatic bidding feature.
- Notified the winner of the auction with message in app.

- Tests
  - All your endpoints must have at least one test, multiple edge case tests are a bonus
  - All tests must pass
  - Separate environment for testing

**Description** :

The REST API should provide adequate JSON responses to these endpoints. The **bolded** endpoints are authenticated calls. Select the appropriate REST calls (get, put, post, delete) by yourself.

**Design (Figma):**

- [Link to Figma](https://www.figma.com/file/uDZgkwfYXsrf90uDlqp7Iu/ahub?type=design&node-id=0-1&mode=design)
- On page Components/Bonus you have UI for bonus version (Autobiding, Messeging).

**Endpoints** :

/signup

```Sign up to the system (username, password)```

/login

```Logs in an existing user with a password```

**/me**

```Get the currently logged in user information```

**/me/auction**

```Post your auction```

**/me/auction/:id**

```Update your auction (you can update only your auctions)```

**/me/update-password**

```Update the current users password```

**/auctions/:id/bid**

```Bid on a auction```

/auctions

```List active auctions orderd by date od auction ending ```

**Check design and if the needed endpoint is not listed, add endpoints that you need.**


**Material (tutorials …)**:

- <a href="https://ionian-pram-941.notion.site/SkillUp-Mentor-Pre-Boarding-SLO-6867a8fefbee4e6c8e073a72c0119aa2" target="_blank">Pre-boarding document</a>
- <a href="https://trello.com/b/zDGE8zl0/project-template" target="_blank">Trello template</a>
- <a href="https://ionian-pram-941.notion.site/SkillUp-Mentor-Pre-Boarding-SLO-6867a8fefbee4e6c8e073a72c0119aa2" target="_blank">Project materials</a>
  
**But first**:
- Share your GitHub repository with mentors@skillupmentor.com
- Share your Trello board with mentors@skillupmentor.com

**Tips (how to start):**

- Backend: 
  - Create a new NestJS project https://docs.nestjs.com/first-steps
  - Create database and connect to it https://docs.nestjs.com/techniques/database
  - Consider what kind of tables we will need and create Entities (we generate a database structure from entities with the help of Prisma, recommended via migrations, but we can also start with the help of sync: true)
  - Add configuration to securely read env variables https://docs.nestjs.com/techniques/configuration
  - Continue creating modules (module, controller, service, repository) following the example of the Repository pattern https://docs.nestjs.com/techniques/database#repository-pattern
- Frontend:
  - <a href="https://vitejs.dev/guide/" target="_blank">Vite React with TypeScript</a>
  - Data structure + Boilerplate: <a href="https://dev.to/yacouri/reactjs-folder-structure-boilerplate-155n" target="_blank">https://dev.to/yacouri/reactjs-folder-structure-boilerplate-155n</a>

**Use Functional Components in React!**

<img alt="Use Functional Components in React!" src="https://brotherants.com/skillupmentor/images/functional-class-compnent.png" width="600px" />

**CODE REVIEW**:
When you finish the project, apply for a code review: <a href="https://forms.gle/sxtxWrzJaom81Dxx8" target="_blank">Code review apply</a>

**Disclaimer :**

*This assignment is protected with SkillUp Mentor copyright. The Candidate may upload the assignment on his closed profile on GitHub (or other platform), but any other reproduction and distribution of the assignment itself or the assignment&#39;s solutions without written permission of SkillUp Mentor is prohibited.*

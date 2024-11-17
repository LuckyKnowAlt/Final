Portfolio Platform using Node.js

Project Overview

This project is a portfolio management platform built using Node.js and MongoDB. The platform allows users to manage portfolio items, with different roles for admins and editors. Admins have full CRUD access, whereas editors have restricted rights. Additionally, the platform integrates third-party APIs to provide data visualization features.

Features:

1. Authentication and Authorization

2. User Registration: Users can sign up with a username, password, first name, last name, age, gender, and set up Two-Factor Authentication (2FA) using an authenticator app.

    Passwords are hashed using bcrypt for secure storage.

    Nodemailer is used to send a welcome email upon registration.

3. User Login: Users can log in using their username and password.

   If 2FA is enabled, users must also provide a 2FA code from their authentication app.

   Users are redirected to the main page upon successful login.

4. Role-Based Access Control:

   The platform supports two roles: admin and editor.

   Admin users can manage all content, whereas editor users can only contribute and create new items but cannot edit or delete existing items.

5. Security:

   Passwords are hashed and stored securely.

   2FA is implemented for enhanced security using speakeasy.

   Session cookies are used to maintain user sessions.


Portfolio Management (CRUD Operations)

1. Portfolio Page: Displays items created by admins, each containing a title, description, and three images in a carousel.

   Admin users can create, update, and delete portfolio items.

   Editor users can create new items but are restricted from editing or deleting existing items.

2. Portfolio Item Requirements:

   Each portfolio item contains a title, description, and three images.

   Images are presented using a carousel for better visualization.

   Timestamps for creation, update, and deletion are included.

3. API Integration and Visualization:

   The platform integrates two third-party APIs to provide insightful data visualization on separate pages:

   Exchange Rate API: Displays historical exchange rate data between currencies using Chart.js.

   PokeAPI: Displays Pokémon information in a visual and interactive format.

   Data is presented using charts and graphs for better understanding.

   Editor users are given options to create new visualizations using these APIs, while regular users have restricted access.

Messaging and Notifications

   A welcome email is sent to users upon successful registration.

   Notification Emails are sent when:

      A new portfolio item is created.

      A portfolio item is updated.

      There are multiple failed login attempts.

Project Organization and Design

   Clean Code and Project Structure:

      The code is modular, following best practices to maintain separation of concerns.

      The project structure is organized with appropriate folders for routes, models, views, and configurations.

Responsive Design and UI:

      The UI is designed using EJS templates and CSS to be visually appealing and responsive across devices.

      Navigation Bar: Each page includes a navigation bar for easy access.

      Footer: Each page has a footer containing the author’s name and group number.

Screenshots and Concise Report

   A concise report with screenshots demonstrating the core functionalities, including:

      User Registration and Login.

      Two-Factor Authentication Setup.

      Portfolio Item Creation, Update, and Deletion.

      API Data Visualization.

Setup Instructions

Clone the Repository:

   git clone <repository-url>
   cd portfolio-platform

Install Dependencies:

   npm install

Environment Variables: Create a .env file in the root directory and provide the following details:

   PORT=3000
   MONGO_URI=<Your MongoDB Connection String>
   EMAIL_USER=<Your Email Address>
   EMAIL_PASS=<Your Email Password>
   EXCHANGE_API_KEY=<Exchange Rate API Key>
   ADMIN_USERNAME=<Admin Username>
   SESSION_SECRET=<Session Secret Key>

Run the Server:

   npm start / node app.js

   The server runs on port 3000 by default.

Access the Application:
   Open your browser and navigate to http://localhost:3000 to access the application.

API Details

   Exchange Rate API: Provides historical exchange rate data, which is used for generating visual graphs on the /api/exchange-rate page.

   Endpoint Example: GET https://v6.exchangerate-api.com/v6/YOUR-API-KEY/history/USD/YEAR/MONTH/DAY

Data visualized using Chart.js.

   PokeAPI: Provides detailed Pokémon information, which is displayed on the /api/pokemon page.

   Example Endpoint: GET https://pokeapi.co/api/v2/pokemon/{pokemon-name}

Design Decisions

   Authentication and Security: Used bcrypt for password hashing and speakeasy for 2FA. This ensures that user credentials are kept safe and secure.

   Role-Based Access Control: Ensured separation of duties by assigning specific actions to admins and editors.

   Data Visualization: Utilized Chart.js to provide meaningful visual representations of data fetched from third-party APIs. This makes data more interactive and easier to interpret.

   Modular Codebase: Divided the project into multiple modules including routes, models, and configurations to ensure the maintainability and readability of the code.

Dependencies

   Express: For server-side functionality.

   Mongoose: To interact with MongoDB.

   Passport: For user authentication.

   bcryptjs: For hashing passwords.

   speakeasy and qrcode: For setting up and verifying 2FA.

   Nodemailer: For sending welcome and notification emails.

   multer: For handling file uploads (portfolio images).

   Chart.js: For data visualization on the frontend.

Folder Structure

   /routes: Contains route files for different modules (index.js, portfolio.js, api.js).

   /models: Defines data models for MongoDB (User.js, PortfolioItem.js).

   /views: Holds EJS templates for rendering pages (register.ejs, login.ejs, portfolio.ejs, etc.).

   /public: Stores static files like CSS and uploaded images.

   /config: Holds configuration files, including Passport and authentication middleware (passport.js, auth.js).

Contribution Guidelines

   Fork the repository and create your own branch for feature development.

   Submit a pull request for code review and approval.

   Ensure code follows best practices and is well commented.

License

   This project is licensed under the MIT License.

"# Project" 

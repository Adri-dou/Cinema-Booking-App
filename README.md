# Cinema Booking App

A full-stack cinema booking web application that lets users browse movies, read details, make reservations, select seats, order food, and manage their user accounts. This app uses **Vue.js** on the frontend, **Node.js** with **Express** on the backend, and **MongoDB Atlas** as the database.

---

## Features

- **User Authentication** : Users can register, log in, and manage their reservations.
- **Movie Search and Details** : Users can search for movies, view synopses, and read reviews.
- **Seat Selection** : Dynamic seat selection for movie reservations.
- **Food Ordering** : Add food items like popcorn, soda, and candy to the order.
- **Admin-Friendly** : Automatically pulls movie data daily when the server starts.

---

## Important Project Structure

```bash
.
├── .env                      # Environment variables
├── .gitignore
├── README.md                 # The file you're actually reading

# Frontend
├── client/cinema-client       # Vue.js frontend code
│   ├── public...              # Public assets and html page
│   │
│   └── src
│       ├── App.vue           # Main app component
│       ├── main.js           # Entry file for Vue
│       ├── assets            # Dynamic component assets
│       │   └── food          # Food-specific images
│       ├── components        # Reusable components
│       ├── router            # Vue Router configuration
│       └── views             # Main views (pages)
│    

# Backend
└── server
    ├── server.js             # Main server entry
    ├── fetchMovies.js        # Movie fetching script
    ├── sessionScheduler.js   # Creating new sessions
    │
    ├── models...             # Moodels for database
    │
    ├── routes...             # Express route handlers
    │
    └── controllers...        # Controllers for business logic
```

---

## Getting Started

### Requirements

Ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB Atlas** (or a local MongoDB instance)

### Setup Instructions

1. **Clone the Repository** and go to the project's root :
   ```bash
   git clone https://github.com/Adri-dou/Cinema-Booking-App
   cd Cinema-Booking-App
   ```

2. **Configure Environment Variables**:
   Modify the `.env` file in the project root to store your MongoDB URI and Tmdb API key.
   ```bash
   # .env
   MONGODB_URI=your_mongodb_uri
   TMDB_API_KEY=your_tmdb_key
   PORT=3000
   ```

3. **Install Dependencies**:

   - **Server**:
     ```bash
     npm install
     ```

   - **Client**:
     ```bash
     cd client/cinema-client
     npm install
     ```

4. **Running the Server**:
   The server will automatically fetch movies from the API if it hasn't done so on the current day and will create associated cinema sessions.

   ```bash
   node server/server.js
   ```

5. **Running the Frontend**:
   Open a new terminal window, navigate to the frontend directory, and start the Vue app.

   ```bash
   cd client/cinema-client
   npm run serve
   ```

6. **Access the App**:
   Visit the link given by Vue in your browser to start using the application. (should be on `http://localhost:8080`)

---

## API Endpoints

| Category         | HTTP Method | Endpoint                           | Description                                                 |
|-------------------|-------------|------------------------------------|-------------------------------------------------------------|
| **General**       | GET         | `/`                                | Health check: Confirms the server is running.               |
| **Movies**        | GET         | `/api/movies`                     | Fetch all movies.                                           |
|                   | GET         | `/api/movies/:id`                 | Fetch a single movie by its ID.                             |
| **Authentication**| POST        | `/api/auth/register`              | Register a new user.                                        |
|                   | POST        | `/api/auth/login`                 | Login and receive a JWT token.                              |
|                   | GET         | `/api/auth/profile`               | Fetch logged-in user profile.                               |
|                   | POST        | `/api/auth/book-session`          | Book a movie session for a user.                           |
| **Sessions**      | GET         | `/api/sessions`                   | Fetch all sessions, optionally filter by movie or date.     |
|                   | POST        | `/api/sessions`                   | Add a new movie session.                                    |
|                   | POST        | `/api/sessions/:sessionId/reserve`| Reserve seats for a specific session.                       |
|                   | GET         | `/api/sessions/:sessionId`        | Fetch session details by its ID.                            |
|                   | DELETE      | `/api/sessions/expired`           | Delete expired sessions.                                    |

---

## Frontend Components

### Key Vue Components

1. **Home.vue** : Displays the list of available movies.
2. **MovieDetails.vue** : Shows details about a selected movie.
3. **FoodOrder.vue** : Allows users to order food items.
4. **SeatSelection.vue** : Lets users choose seats for a movie showing.
5. **Login.vue / Register.vue** : User authentication components.

---

## Backend Structure

The backend is powered by **Express** with the following setup:

- **server.js** : The main server file, handling routes and database connections.
- **fetchMovies.js** : Script that fetches movies from an external API to populate MongoDB if there are no movies added today.
- **Routes** : Each route file should map to specific controllers that contain the business logic for handling requests and responses.

---

This project provides a comprehensive cinema booking solution. Feel free to explore, fork the project and expand upon its functionality!

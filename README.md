# FITRAA

A full-stack fitness tracking application that helps users manage workouts, diet, daily fitness activities, and overall progress through a personalized and responsive platform.

## Project Overview

FITRAA is a fitness management web application developed using the MERN stack. It provides users with personalized workout plans, workout tracking, diet monitoring, water and calorie tracking, progress analytics, workout streaks, and profile management.

The application uses JWT-based authentication to provide secure access and stores user fitness data in MongoDB. Profile images are managed using Cloudinary.

## Live Demo

**Frontend:**  
https://fitraa-eta.vercel.app

**Backend API:**  
https://fitraa-backend.onrender.com

> The backend is hosted on Render's free tier. The first request may take a short time if the server has been inactive.

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- User fitness profile setup
- Personalized workout generation
- Workout tracking and completion status
- Workout timer
- Workout feedback
- Workout streak tracking
- Diet-plan management
- Meal-completion tracking
- Additional food tracking
- Daily water-intake tracking
- Calories consumed and burned tracking
- Fitness history and progress analytics
- Weekly workout activity
- Dynamic fitness insights
- Profile management
- Profile-image upload using Cloudinary
- Dark and light modes
- Responsive user interface

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- Multer
- Cloudinary

### Deployment

- Frontend — Vercel
- Backend — Render
- Database — MongoDB Atlas
- Image Storage — Cloudinary
- Version Control — Git and GitHub

## Project Structure

```text
Fitraa/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

> Environment files are excluded from Git and must not be committed to the repository.

## Future Improvements

- Advanced personalized workout recommendations
- Custom workout-plan creation
- Personalized calorie and nutrition targets
- Workout reminders and notifications
- Exercise demonstration videos
- Detailed monthly progress reports
- Improved mobile experience

## Author

**Mansha T R**
https://www.linkedin.com/in/manshatr/



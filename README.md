# URL Shortener

A secure URL shortener built with Node.js, Express, MongoDB, and EJS. Users can sign up, log in, create shortened URLs, and track visit analytics for their own links.

## Overview
This project allows authenticated users to:
- create shortened URLs
- redirect short links to their original destinations
- view analytics for their generated URLs
- manage access using JWT-based authentication

## Tech Stack
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Views: EJS
- Auth: JWT in HTTP-only cookies
- Password hashing: bcryptjs
- Validation: custom URL and email validation

## Features
- ✅ Signup and login flow
- ✅ JWT cookie-based authentication
- ✅ Role-based route protection for NORMAL and ADMIN users
- ✅ Secure password hashing with bcryptjs
- ✅ URL shortening using unique nanoid-based IDs
- ✅ Redirect tracking with visit history
- ✅ User-specific dashboard showing only that user’s links
- ✅ Input validation for email, password, and URL format
- ✅ Security headers for safer browser behavior

## Project Structure
```bash
URL-Shortener/
├── controllers/
│   ├── url.js
│   └── user.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── url.js
│   └── user.js
├── routes/
│   ├── staticRouter.js
│   ├── url.js
│   └── user.js
├── service/
│   └── auth.js
├── utils/
│   └── validation.js
├── views/
│   ├── home.ejs
│   ├── login.ejs
│   └── signup.ejs
├── .env
├── connect.js
├── app.js
├── package.json
├── README.md
└── tests/
    └── serverless.test.js
```

## Environment Variables
Create a `.env` file using the example:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=your-very-strong-random-secret
NODE_ENV=development
```

For production, use a strong secret and a real MongoDB connection string.

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally or in a managed cloud instance
- npm

### Install dependencies
```bash
npm install
```

### Start the app
```bash
npm start
```

### Run in development mode
```bash
npm run dev
```

## Authentication Flow
1. User visits `/signup` and creates an account.
2. User logs in at `/login`.
3. Server validates the email and password.
4. A signed JWT is created and stored in an HTTP-only cookie named `uuid`.
5. Protected pages and API routes verify the cookie before allowing access.
6. Users can only see and manage their own shortened URLs.

## Routes

### Public Routes
- `GET /signup` – show signup page
- `POST /signup` – create a new user
- `GET /login` – show login page
- `POST /login` – authenticate user

### Protected Routes
- `GET /` – view the logged-in user dashboard
- `POST /url` – create a short URL
- `GET /url/:id` – redirect to the original URL and track the visit
- `GET /url/analytics/:id` – view visit history for a short URL

## Data Models

### User
```js
{
  name: String,
  email: String,
  password: String,
  role: "NORMAL" | "ADMIN",
  createdAt: Date,
  updatedAt: Date
}
```

### URL
```js
{
  shortId: String,
  redirectUrl: String,
  createdBy: ObjectId,
  visitHistory: [{ timestamp: Number }],
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes
This version includes several production-minded protections:
- password hashing via bcryptjs
- JWT expiry set to 7 days
- required JWT secret in production
- secure cookie flags for HTTP-only and same-site behavior
- URL validation to prevent malformed or unsafe redirect targets
- generic input validation for signup and login
- security headers such as `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`

## Testing
```bash
npm test
```

The test suite checks:
- Express app export behavior
- URL validation correctness
- password hashing and verification

## Production Recommendations
For real deployment, also consider:
- rate limiting
- request logging
- CSRF protection if you add browser-based state-changing forms
- HTTPS enforcement behind a reverse proxy
- a managed MongoDB deployment
- environment-based configuration in production hosting

## License
MIT

## Live Link

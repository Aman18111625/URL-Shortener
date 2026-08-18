# URL-Shortener

## Overview
A secure URL Shortener service that allows authenticated users to create shortened URLs, track visits/clicks, and manage their links. Features user authentication, role-based access control, and MongoDB integration.

## Features
- ✅ User authentication (Signup & Login)
- ✅ Cookie-based session management with JWT tokens
- ✅ Role-based access control (NORMAL, ADMIN roles)
- ✅ Shorten long URLs with unique IDs
- ✅ Track visit analytics for shortened URLs
- ✅ User-specific URL management (each user can only see their own URLs)
- ✅ Secure password storage

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT tokens stored in HTTP-only cookies
- **Templating:** EJS
- **Password Hashing:** Built-in (implement bcrypt for production)

## Project Structure
```
URL-Shortener/
├── controllers/
│   ├── user.js           # User signup & login logic
│   └── url.js            # URL shortening & analytics logic
├── middlewares/
│   └── authMiddleware.js # Authentication & role-based access control
├── models/
│   ├── user.js           # User schema (name, email, password, role)
│   └── url.js            # URL schema (shortId, redirectUrl, visitHistory)
├── routes/
│   ├── user.js           # POST /signup, POST /login, GET /login, GET /signup
│   ├── url.js            # POST /url (create), GET /url/:id (redirect), GET /url/analytics/:id
│   └── staticRouter.js   # GET / (homepage with user's URLs)
├── service/
│   └── auth.js           # JWT token generation & verification
├── views/
│   ├── home.ejs          # Homepage (displays user's URLs)
│   ├── login.ejs         # Login form
│   └── signup.ejs        # Signup form
├── connect.js            # MongoDB connection setup
├── index.js              # Express app setup & middleware configuration
├── package.json
└── README.md
```

## API Routes

### Public Routes (No Authentication Required)

#### 1. User Signup
- **Route:** `GET /signup`
- **Description:** Display signup form
- **Response:** HTML form

#### 2. User Login (Form)
- **Route:** `GET /login`
- **Description:** Display login form
- **Response:** HTML form

#### 3. Create User Account
- **Route:** `POST /signup`
- **Method:** POST
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Redirects to `/` after account creation
- **Default Role:** NORMAL

#### 4. User Login
- **Route:** `POST /login`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Sets JWT token in cookie, redirects to `/` if successful
- **Error:** Returns login page with error message if credentials invalid

### Protected Routes (Authentication + Role-Based Access Required)

**Authentication:** Requires valid JWT token in `uuid` cookie
**Allowed Roles:** NORMAL, ADMIN

#### 1. Homepage
- **Route:** `GET /`
- **Description:** Display user's dashboard with all their shortened URLs
- **Response:** HTML page with URL list and analytics
- **Required Roles:** NORMAL, ADMIN

#### 2. Create Shortened URL
- **Route:** `POST /url`
- **Method:** POST
- **Body:**
  ```json
  {
    "url": "https://www.example.com/very/long/url"
  }
  ```
- **Response:**
  ```json
  {
    "shortId": "abc12345"
  }
  ```
- **Required Roles:** NORMAL, ADMIN

#### 3. Redirect to Original URL
- **Route:** `GET /url/:id`
- **Description:** Redirect to original URL and log visit analytics
- **Example:** `GET /url/abc12345`
- **Response:** HTTP 302 redirect to original URL
- **Side Effect:** Records visit timestamp in visitHistory
- **Required Roles:** NORMAL, ADMIN

#### 4. Get Analytics
- **Route:** `GET /url/analytics/:id`
- **Description:** Get visit analytics for a shortened URL
- **Example:** `GET /url/analytics/abc12345`
- **Response:**
  ```json
  {
    "shortId": "abc12345",
    "redirectUrl": "https://www.example.com/very/long/url",
    "totalClicks": 5,
    "visitHistory": [
      { "timestamp": 1692374456000 },
      { "timestamp": 1692374567000 }
    ]
  }
  ```
- **Required Roles:** NORMAL, ADMIN

## Authentication Flow

### Login Process
1. User visits `/` → No cookie detected
2. Redirected to `/login`
3. User submits credentials via `POST /login`
4. Server verifies credentials against MongoDB
5. If valid: JWT token generated with user data (\_id, email, role) and set in `uuid` cookie
6. User redirected to `/`
7. Middleware verifies cookie and sets `req.user` object
8. Homepage loads with user's URLs

### Role-Based Access Control
- **Middleware Chain:**
  1. `restrictToLoggedInUserOnly` → Checks if user has valid JWT cookie
  2. `restrictTo(["NORMAL", "ADMIN"])` → Checks if user's role is in allowed list

- **Roles:**
  - `NORMAL` - Regular users, can create/manage their own URLs
  - `ADMIN` - Admin users (future use, same access as NORMAL currently)

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (running on `mongodb://localhost:27017`)
- npm

### Steps

1. **Clone/Navigate to project:**
   ```bash
   cd /Users/amangupta997/Desktop/URL-Shortener
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   ```

4. **Start the server:**
   ```bash
   node index.js
   ```
   or with auto-reload:
   ```bash
   npm install -g nodemon
   nodemon index.js
   ```

5. **Access the application:**
   - Open browser: `http://localhost:3000`
   - You'll be redirected to login page
   - Signup or login to start creating shortened URLs

## Environment Variables
Currently using hardcoded values. For production, use `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=Aman$%!213$524Gupt*&a
PORT=3000
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ["NORMAL", "ADMIN"], default: "NORMAL"),
  createdAt: Date,
  updatedAt: Date
}
```

### URL Model
```javascript
{
  _id: ObjectId,
  shortId: String (required, unique),
  redirectUrl: String (required),
  createdBy: ObjectId (reference to User),
  visitHistory: [
    {
      timestamp: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Recent Changes (v2.0)

### Authentication
- ✅ Implemented cookie-based session management with JWT
- ✅ Added user signup/login functionality
- ✅ JWT tokens now include user role for access control

### Security
- ✅ Protected routes require valid authentication
- ✅ Role-based access control on protected endpoints
- ✅ Passwords stored in cookies (⚠️ upgrade to bcrypt in production)
- ✅ HTTP-only cookies for JWT storage

### Routes
- ✅ Public: `/login`, `/signup` (GET & POST)
- ✅ Protected: `/`, `/url/*` (require auth + NORMAL/ADMIN role)

### User Experience
- ✅ Homepage displays only authenticated user's shortened URLs
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Error messages for invalid credentials
- ✅ Visit analytics tracked per shortened URL

## Future Enhancements
- [ ] Email verification for signup
- [ ] Password reset functionality
- [ ] Admin dashboard for managing all users
- [ ] Custom short URL slugs
- [ ] Expiry date for shortened URLs
- [ ] Rate limiting on URL creation
- [ ] Advanced analytics (geographic data, device info)
- [ ] API key authentication for programmatic access
- [ ] Bcrypt password hashing

## Known Issues / TODO
- [ ] Implement bcrypt for secure password hashing
- [ ] Add input validation for URLs
- [ ] Add CSRF protection
- [ ] Implement proper error handling
- [ ] Add logging system

## Testing

### Test Signup
1. Visit `http://localhost:3000/signup`
2. Fill form with name, email, password
3. Submit → should redirect to login

### Test Login
1. Visit `http://localhost:3000/login`
2. Enter valid credentials
3. Submit → should redirect to homepage with cookie set

### Test URL Shortening
1. Login successfully
2. On homepage, enter a long URL
3. Submit → should see shortened URL
4. Click shortened URL → should redirect to original

### Test Analytics
1. Create/use a shortened URL
2. Visit `GET /url/analytics/:shortId` → should show visit count

## License
MIT


# Utsav Darshan - City Festival & Cultural Calendar Platform

A crowdsourced web platform to discover city-level festivals, melas, yatras and cultural events across India.

## Features
- City-wise event listings, search, category filters, pagination
- Monthly and weekly calendar views, ongoing and upcoming badges
- Event detail page with venue map, save, share and report
- Contributor accounts: submit, edit and cancel events, poster upload, map picker
- Admin dashboard: approve or reject events, edit or delete listings, manage categories, handle reports, usage stats and activity log
- Security: JWT auth, role-based access, helmet, rate limiting, input validation

## Tech stack
React (Vite), Tailwind CSS, Leaflet, Node.js, Express, MongoDB (Mongoose)

## Setup
1. Clone the repo and open two terminals.
2. Backend:
   cd server
   npm install
   copy .env.example to .env and fill in the values
   npm run seed
   npm run dev
3. Frontend:
   cd client
   npm install
   npm run dev
4. Open http://localhost:5173

Default admin: the email and password from ADMIN_EMAIL and ADMIN_PASSWORD in server/.env.

## Environment variables
Server: PORT, MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_URL
Client (production): VITE_API_URL (the deployed backend URL)

## Deployment
- Frontend: Vercel or Netlify, root directory client, build command npm run build, output dist, set VITE_API_URL
- Backend: Render or AWS, root directory server, start command npm start, set the server variables, set CLIENT_URL to the frontend URL
- Database: MongoDB Atlas
- Note: uploaded posters are stored on the server disk. Use persistent storage or a service such as Cloudinary in production.
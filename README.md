# AgriTech – Empowering Farmers Through Digital Technology

A beginner-friendly MERN starter app for farm/crop management, soil records, and weather lookup.

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas

## Run locally

### Backend
1. Open a terminal in `server`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGO_URI` and a long random `JWT_SECRET`.
4. Run `npm run dev`.

### Frontend
1. Open another terminal in `client`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` if needed.
4. Run `npm run dev`.
5. Open the Vite URL shown in the terminal (usually http://localhost:5173).

## Features
- Registration/login using JWT
- Add/list/delete farms
- Add/list/delete crops
- Save soil analysis readings
- Weather lookup (clearly labeled demo data until an API key is configured)
- Responsive dashboard

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/farms`
- `DELETE /api/farms/:id`
- `GET|POST /api/crops`
- `DELETE /api/crops/:id`
- `GET|POST /api/soil`
- `GET /api/weather?city=Indore`
- `GET /api/health`

Authenticated endpoints require `Authorization: Bearer <token>`.

## Deployment
Deploy frontend (for example, Vercel), backend (for example, Render), and MongoDB (Atlas). Configure `VITE_API_URL` to your deployed backend URL ending in `/api`, and set backend environment variables. Set `CLIENT_URL` to the deployed frontend origin. Do not commit `.env` files or secrets.

This is a starter implementation. Run and test the app and configure your own credentials before submitting it as a live project.

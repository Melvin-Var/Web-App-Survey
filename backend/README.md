# Refuge Survey Backend

This is the backend server for the Refuge Survey application. It provides API endpoints for managing survey data and user authentication.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase project with Firestore database

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=8080
FIREBASE_PROJECT_ID=refuge-survey
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

3. Place your Firebase service account key file in the project root directory.

## Development

To start the development server with hot reloading:
```bash
npm run dev
```

## Production

To start the production server:
```bash
npm start
```

## Testing

To run tests:
```bash
npm test
```

## API Documentation

The API documentation will be available at `/api-docs` when the server is running.

## Environment Variables

- `PORT`: The port number the server will listen on (default: 8080)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NODE_ENV`: The environment mode (development/production)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Firebase service account key file 
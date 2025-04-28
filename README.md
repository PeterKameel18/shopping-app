# Shopping App

A full-stack shopping application built with React Native, Node.js, MongoDB, and Stripe integration.

## Features

- User Authentication (Login/Register)
- Product Browsing
- Shopping Cart
- Checkout with Stripe (Demo Mode)
- Order Confirmation

## Project Structure

```
shopping-app/
├── client/          # React Native frontend
├── server/          # Node.js backend
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- React Native development environment
- Stripe account (for API keys)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:19000

## Testing Stripe Integration

- Use test card number: 4242 4242 4242 4242
- Any future expiry date
- Any 3-digit CVC
- Any billing address

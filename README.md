# Waitlist API

This project provides a simple API for managing user subscriptions and sending emails for a launch event.

## Features

- **User Subscription:** Accepts user details (name and email) and saves them.
- **Waitlist Position:** Users can see their position on the waitlist.
- **Email Notifications:** Sends welcome and launch emails using Brevo SMTP relay.
- **Mongoose Integration:** Stores subscriber details in MongoDB.
- **API Authentication:** Protected routes using API key authentication.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/)
- A [Brevo](https://www.brevo.com/) account for email services

### Installation

1. Clone the repository:

    ```sh
    git clone <repository-url>
    cd waitlist-api
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory with the following contents:

    ```env
    PORT=5000
    MONGO_URI=your-mongodb-uri
    BREVO_API_KEY=your-brevo-api-key
    BREVO_SENDER_EMAIL=your-verified-sender-email
    API_KEY=your-secret-api-key
    LAUNCH_URL=your-launch-url
    ```

### Running the Application

Start the application using:

```sh
npm run dev    # For development
npm start      # For production
```

The API will run on `http://localhost:5000`.

## API Endpoints

### Public Endpoints

- **POST /api/subscribe**
  - Subscribe a new user to the waitlist
  - Body: `{ "name": "string", "email": "string" }`
  - Returns: Waitlist position and success message

### Protected Endpoints (Requires API Key)
Add `x-api-key` header with your API key for these endpoints:

- **POST /api/remove_user**
  - Remove a user from the waitlist
  - Body: `{ "email": "string" }`
  - Headers: `x-api-key: your-api-key`

- **GET /api/get_all**
  - Get all subscribed users
  - Headers: `x-api-key: your-api-key`

- **POST /api/send_mail**
  - Send launch emails to all subscribers
  - Headers: `x-api-key: your-api-key`

## Project Structure

- **src/controllers:** Contains the API controller logic
- **src/model:** Contains the Mongoose user model
- **src/routes:** Defines the API routes
- **src/services:** Contains the mailer service
- **src/middleware:** Contains authentication middleware
- **src/types:** Contains TypeScript interfaces
- **src/config:** Contains database configuration

## Security

- API key authentication for protected routes
- Environment variables for sensitive data
- Input validation for email format
- Error handling for failed operations

## License

[MIT](LICENSE)

## Author

IfeCodes
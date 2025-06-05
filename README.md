# Waitlist API

This project provides a simple API for managing user subscriptions and sending emails for a launch event.

## Features

- **User Subscription:** Accepts user details (name and email) and saves them.
- **Email Notifications:** Sends launch emails using Nodemailer with Brevo SMTP relay.
- **Mongoose Integration:** Stores subscriber details in MongoDB.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/)
- An SMTP account (using [Brevo](https://www.brevo.com/) in this example)

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
    EMAIL_USER=your-email@example.com
    EMAIL_PASS=your-smtp-password
    MONGO_URI=your-mongodb-uri
    PORT=3000
    ```

### Running the Application

Start the application using:

```sh
npm start
```

The API will run on `http://localhost:3000`.

**Development and Build Scripts:**

- You use `npm run dev` during development → nodemon runs `src/index.ts`.
- You use `npm run build` to compile to `dist/index.js`.
- You use `npm start` for production → runs `node dist/index.js`.

## API Endpoints

- **POST /subscribe**

  Endpoint to subscribe a user. Expects a JSON body with `name` and `email`.

- **POST /send-mail**

  Endpoint to send a launch email. Expects a JSON body with `name` and `email`.

## Project Structure

- **src/controllers:** Contains the API controller logic (subscription and mail sending).
- **src/model:** Contains the Mongoose user model.
- **src/routes:** Defines the API routes.
- **src/services:** Contains the mailer service using Nodemailer.

## .gitignore

The project ignores the following directories/files:
- `node_modules`
- `.env`
- `dist`

## License

[MIT](LICENSE)

## Author

IfeCodes
# SyncRoom Server

This folder contains the backend server for the SyncRoom application. The server is responsible for handling API requests, managing data, and ensuring smooth communication between the client and the database.

## Features

- RESTful API endpoints for client-server communication.
- User authentication and authorization.
- Real-time data synchronization.
- Database management and CRUD operations.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running instance of the database (e.g., MongoDB, PostgreSQL, etc.)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Yashh56/SyncRoom-Server.git
    cd SyncRoom-Server
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and configure the following variables:
    ```
    DATABASE_URL=<your-database-url>
    MONGODB_URL=<your-mongodb-url>
    JWT_SECRET=<your-secret-key>
    PORT=<your-port-number>
    REDIS_PASSWORD=<your-redis-password>
    REDIS_HOST=<your-redis-host>
    GOOGLE_CLIENT_ID=<your-google-client-id>
    GOOGLE_CLIENT_SECRET=<your-google-client-secret>
    ```

4. Generate Prisma client:
    ```bash
    npx prisma generate
    ```

## Usage

### Development

Start the server in development mode:
```bash
npm run dev
# or
yarn dev
```

### Production

Build and start the server:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Prisma Commands

- Generate Prisma client:
    ```bash
    npx prisma generate
    ```

- Run database migrations:
    ```bash
    npx prisma migrate dev
    ```

- Open Prisma Studio:
    ```bash
    npx prisma studio
    ```

## Folder Structure

```
server/
├── Chats/             # Handles chat-related functionality
├── Messages/          # Contains database models for messages
├── middlewares/       # Middleware functions for API routes
├── Prisma/            # Database schema and ORM configuration
├── Room/              # Manages room-related logic
├── User/              # Manages user-related logic
├── utils/             # General utility functions
├── websocket/         # WebSocket implementation for real-time communication
├── __tests__/         # Unit and integration tests
├── index.js           # Entry point of the server
├── .env               # Environment variables configuration
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation
```

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
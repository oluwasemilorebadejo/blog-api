## Introduction

This documentation provides an overview of the codebase for a Node.js application that serves as a basic API for user authentication and managing blog posts. The application is built using Express.js and utilizes TypeORM for database interaction. Below, you'll find details on the main components of the codebase, including server setup, routing, controllers, and middleware.

## Prerequisites

Before setting up the project, ensure that you have the following prerequisites installed on your development environment:

1. Node.js and npm: Download and install Node.js and npm from [nodejs.org](https://nodejs.org/).
2. PostgreSQL: Install PostgreSQL, a relational database system, and set up a database for the project. You'll need the database connection details.

## Project Setup

Follow these steps to set up the project:

1. **Clone the Repository**: `git clone https://github.com/oluwasemilorebadejo/blog-api.git`
2. **Navigate to the Project Directory**: `cd blog-api`
3. **Install Dependencies**: `npm install`
4. **Environment Variables**:

   - Create a `.env` file in the project root directory to store environment variables. You can use the provided `config.env` as a template.
   - Configure the following environment variables in your `.env` file:
     - `NODE_ENV`: Set to "development" for development environment.
     - `PORT`: Port number for the server.
     - `DATABASE_HOST`: PostgreSQL database connection URL.
     - `DATABASE_PORT`: 5432
     - `DATABASE_USERNAME`: PostgreSQL database connection URL.
     - `DATABASE_PASSWORD`: PostgreSQL database connection URL.
     - `DATABASE_NAME`: PostgreSQL database connection URL.

5. **Database Setup**:

   - Ensure PostgreSQL is running.
   - Create a PostgreSQL database that matches the `DATABASE_URL` in your `.env` file.

6. **TypeORM Configuration**:

   - Open `ormconfig.json` in the project root directory.
   - Update the `url` property with your PostgreSQL database connection URL.

7. Run `npm start` to run the project.

## Server Configuration (`server.ts`)

### Overview

The `server.ts` file is the entry point for the application. It sets up the server, connects to the database, and handles uncaught exceptions.

### Configuration

1. **Uncaught Exception Handling**: Any unhandled exceptions are caught and logged before the application exits.
2. **Environment Variables**: Loads environment variables from a `config.env` file using the `dotenv` package.
3. **Database Connection**: Connects to the database using TypeORM.

## Application Setup (`app.ts`)

### Overview

The `app.ts` file sets up the Express application, configures middleware, and defines routing for the API.

### Middleware

1. **Logging**: If the environment is set to "development," HTTP request logging is enabled using the `morgan` middleware.
2. **JSON Parsing**: The application uses `express.json()` to parse JSON request bodies.
3. **Cookie Parsing**: The `cookie-parser` middleware is used to parse cookies.

### Routing

1. **Authentication Routes**: Routes related to user authentication are defined in the `auth.route.ts` file and mounted under the `/api/v1/auth` path.
2. **Post Routes**: Routes for managing blog posts are defined in the `post.route.ts` file and mounted under the `/api/v1/posts` path.
3. **Error Handling**: A catch-all route handler sends a 404 error for undefined routes.

### Global Error Handling

Global error handling middleware (`globalErrorHandler`) is used to catch and format errors consistently throughout the application.

## Authentication Routes (`auth.route.ts`)

### Overview

The `auth.route.ts` file defines routes related to user authentication, including user signup and login.

### Routes

1. **POST `/signup`**: Allows users to register with their email, username, and password.
2. **POST `/login`**: Handles user login using email and password credentials.

## Blog Post Routes (`post.route.ts`)

### Overview

The `post.route.ts` file defines routes for managing blog posts, including creating, updating, deleting, and retrieving posts. These routes are protected and require authentication.

### Middleware

1. **Authentication Middleware**: The `protect` middleware is used to ensure that only authenticated users can access these routes.

### Routes

1. **GET `/`**: Retrieves a list of blog posts. Supports pagination, filtering, sorting, and field selection via query parameters.
2. **POST `/`**: Creates a new blog post.
3. **GET `/:id`**: Retrieves a specific blog post by ID.
4. **PATCH `/:id`**: Updates a specific blog post by ID.
5. **DELETE `/:id`**: Deletes a specific blog post by ID.

## Authentication Controllers (`auth.controller.ts`)

### Overview

The `auth.controller.ts` file contains controller functions for user authentication, including signup and login.

### Controller Functions

1. **`signup`**: Handles user registration by checking for existing users, password matching, and creating and sending a token upon successful registration.
2. **`login`**: Handles user login by verifying user credentials and sending a token upon successful login.

## Blog Post Controllers (`post.controller.ts`)

### Overview

The `post.controller.ts` file contains controller functions for managing blog posts.

### Controller Functions

1. **`addPost`**: Creates a new blog post associated with the authenticated user.
2. **`updatePost`**: Updates an existing blog post based on the provided ID.
3. **`getPost`**: Retrieves a specific blog post by ID.
4. **`deletePost`**: Deletes a specific blog post by ID.
5. **`getAllPosts`**: Retrieves a list of blog posts with support for pagination, filtering, sorting, and field selection.

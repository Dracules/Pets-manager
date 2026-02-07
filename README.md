# CRUD-server 'Cats'

A Node.js backend for managing user data and their cats' data with REST endpoints.

## Features

- MongoDB database + Mongoose ODM
- JWT authentication and authorization
- Request validation using class-vaidator
- Custom error filters for error handling
- Middleware for console-logging
- Caching for specific endpoints
- Unit and E2E tests for cat-related endpoints
- Docker conteinerization
- CI using GitHub Actions with tests and linter
  
## Technology Stack

- **Runtime**: Node.js
- **Framework**: Nest
- **Language**: TypeScript
- **Database**: MongoDB
- **Auth**: JWT + bcrypt
- **Testing**: Jest
- **DevOps**: Docker, GitHub Actions

## API Endpoints

| Method | Endpoint                  | Description              | Auth Required       |
|--------|---------------------------|--------------------------|---------------------|
| POST   | /auth/login               | User login               | No                  |
| POST   | /auth/register            | User register            | No                  |
| POST   | /auth/register/admin      | Admin register           | Yes (only admins)   |
| GET    | /auth/profile             | Get user profile         | Yes                 |
| GET    | /animals/cats             | List of all cats         | No                  |
| GET    | /animals/cats/user        | List of user cats        | Yes                 |
| GET    | /animals/cats/:id         | Get cat by id            | Yes                 |
| POST   | /animals/cats             | Create cat               | Yes                 |
| PUT    | /animals/cats/:id         | Update cat               | Yes                 |
| DELETE | /animals/cats/:id         | Delete cat               | Yes                 |

## Git Flow methodology usage

This project uses Git Flow methodology with a clear branching strategy for clean history and team work. For each feature, fix or change I create separate branches (like `feat/add-ci-cd`) with detailed Pull-Requests that explain the changes. Inside each branch code is split into small commits. All commits are categorized as `feat`, `fix`, `chore`, `refactor`. I used Squach and merge to combine everything into one clean commit on the master-branch.

## Testing

### Run unit-tests

`npm run test`

### Run e2e-tests

`npm run test:e2e`

### Run all tests

`npm run test:all`

# Application 'Pets manager'

Single-page application for managing user data and their pets' data with a Node.js CRUD-server and React+Vite client. Available following pets' types: cats, dogs, parrots.

## Key Features

### User Capabilities

- **Browse animals** — View all animals and filter by type (cats, dogs, parrots)
- **Personal workspace** — Manage your own pets with a dedicated "My Animals" section
- **Create & Edit** — Add new animals or update existing ones using corresponding forms
- **Delete animals** — Remove animals from your collection with one click
- **Pagination** — Navigate through large datasets with ease
- **Sorting** — Sort by allowed columns with visual indicators
- **Authentication** — Login and registration with JWT tokens
- **Notifications** — Notifications for successful operations or validation errors

### Role-based Access

- **Guest users** can browse all animals (read-only access)
- **Registered users** can manage their own animals
- **The Admin role** is architecturally ready — role-based decorators are implemented and can be applied to future endpoints with user management privileges.

## Features

### Server

- MongoDB database + Mongoose ODM
- JWT authentication and authorization
- Request validation using class-validator
- Custom error filters for error handling
- Middleware for console-logging
- Caching simulation for specific endpoints
- Unit and E2E tests for cat-related endpoints
- Docker containerization
- CI using GitHub Actions with tests and linter

### Client

- SPA (Single Page Application) React Router navigation
- Tables with pagination (TanStack Table + MUI Pagination)
- Forms with validation schemas (React Hook Form + Yup)
- Intuitive UX: notifications (React Toastify), load indicators (React Spinners)

## Technology Stack

### Common

- **Language**: TypeScript
- **DevOps**: Docker

### Server

- **Runtime**: Node.js
- **Framework**: Nest
- **Database**: MongoDB
- **Auth**: JWT (access + refresh) + bcrypt
- **Testing**: Jest
- **DevOps**: GitHub Actions

### Client

- **Core**: React + Vite
- **Routing**: React Router
- **UI**: React Pro Sidebar, Material UI (MUI) Pagination
- **Data Fetching**: Axios
- **Forms & Validation**: React Hook Form, Yup
- **Data Grid**: TanStack React Table
- **UX Utilities**: React Toastify, React Spinners, React DatePicker

## Server API Endpoints (port 3000)

`{animal}` — one of: `cats`, `dogs`, `parrots`

| Method                   | Endpoint                   | Description                        | Auth Required     |
| ------------------------ | -------------------------- | ---------------------------------- | ----------------- |
| **All animals**          |                            |                                    |                   |
| GET                      | /animals                   | List all animals                   | No                |
| GET                      | /animals/user              | List active user animals           | Yes               |
| GET                      | /animals/user/:id          | List selected user animals         | Yes               |
| **Specific animal type** |                            |                                    |                   |
| GET                      | /animals/{animal}          | List animals by type               | No                |
| GET                      | /animals/{animal}/:id      | Get animal by ID                   | Yes               |
| GET                      | /animals/{animal}/user     | List active user animals by type   | Yes               |
| GET                      | /animals/{animal}/user/:id | List selected user animals by type | Yes               |
| POST                     | /animals/{animal}          | Create animal                      | Yes               |
| PUT                      | /animals/{animal}/:id      | Update animal                      | Yes               |
| DELETE                   | /animals/{animal}/:id      | Delete animal                      | Yes               |
| **Authentication**       |                            |                                    |                   |
| POST                     | /auth/login                | Login user                         | No                |
| POST                     | /auth/register             | Register user                      | No                |
| POST                     | /auth/register/admin       | Register admin                     | Yes (only admins) |

## Client Routes (port 3001)

`{animal}` — one of: `cats`, `dogs`, `parrots`

| Endpoint                 | Description                        | Auth Required |
| ------------------------ | ---------------------------------- | ------------- |
| **All animals**          |                                    |               |
| /                        | All animals page                   | No            |
| /my/                     | All active user animals page       | Yes           |
| /owner/:id/              | All selected user animals page     | Yes           |
| **Specific animal type** |                                    |               |
| /{animal}                | Animals by type page               | No            |
| /my/{animal}             | Active user animals page by type   | Yes           |
| /owner/:id/{animal}      | Selected user animals page by type | Yes           |
| **Authentication**       |                                    |               |
| /login                   | Login page                         | No            |
| /register                | Register page                      | No            |
| **Editor**               |                                    |               |
| /edit                    | Editor page (creation mode)        | Yes           |
| /edit/:id                | Editor page (edit mode)            | Yes           |
| **System**               |                                    |               |
| \*                       | 404 Not Found page                 | No            |

## Screenshots

### Main Workspace: All animals

<img width="800" alt="Image" src="https://github.com/user-attachments/assets/6f3238ac-c1f1-4bae-99eb-44411df9c710" />

### Main Workspace: User dogs

<img width="800"  alt="Image" src="https://github.com/user-attachments/assets/879c1e99-ec2c-499d-b99d-f55c2e29fa5b" />

### Editor & Validation

<img width="400"  alt="Image" src="https://github.com/user-attachments/assets/00229048-f1ac-4797-94fa-0b77dd884628" />

### Login & Registration

<img width="600"  alt="Image" src="https://github.com/user-attachments/assets/900366e1-e2a2-401a-a74c-0c85d21771ff" />

## Git Flow methodology usage

This project uses Git Flow methodology with a clear branching strategy for clean history and team work. For each feature, fix or change, separate branches were created (like `feat/add-ci-cd`) with detailed Pull Requests that explain the changes. Inside each branch, code is split into small commits. All commits are categorized as `feat`, `fix`, `chore`, `refactor`. Squash and merge was used to combine everything into one clean commit on the master-branch.

## Testing

Unit and e2e tests are implemented as examples:

- **Unit tests:** `cat.service.spec.ts`, `cat.dto.spec.ts` for CatService, CatDTO
- **E2E tests:** `cat.controller.e2e-spec.ts` for CatController

### Run tests

```bash
npm run test ### Run unit-tests

npm run test:e2e ### Run e2e-tests

npm run test:all ### Run all tests
```

## Installation

### Prerequisites

- Node.js
- MongoDB
  or
- Docker

### Setup

#### Manually

1. Clone the repository

```bash
git clone https://github.com/Dracules/CRUD-Server-with-Nest-Mongo.git
```

2. Create and configure environment files

   Create `.env` and `.env.docker` files from respective templates and fill in necessary variables

3. Install dependencies for client and server

```bash
cd server && npm install
cd client && npm install
```

4. Run the application

Terminal 1 - Server

```bash
cd server && npm run start:dev
```

Terminal 2 - Client

```bash
cd client && npm run dev
```

#### Using Docker

Steps 1 and 2 are the same as above.

3. Run the application

```bash
docker-compose --env-file ./server/.env up -d
```

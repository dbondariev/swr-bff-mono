# SWR BFF Mono

A modern full-stack monorepo application demonstrating user management with BFF (Backend for Frontend) architecture pattern.

## 📋 Description

This project showcases a complete user management system built with modern web technologies. It features a React frontend with SWR for data fetching, a Fastify BFF layer for API orchestration, and a JSON server as a mock backend. The architecture demonstrates how to structure a monorepo with shared contracts and type-safe communication between services.

## 🛠 Tech Stack

### Frontend (Web App)
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **SWR** - Data fetching and caching library
- **Material-UI (MUI)** - Component library for UI
- **Emotion** - CSS-in-JS for styling

### Backend for Frontend (BFF)
- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe server development
- **Zod** - Schema validation and type inference
- **TSX** - TypeScript execution for development

### Mock API Server
- **JSON Server** - Quick REST API prototyping

### Monorepo Tools
- **PNPM** - Fast, disk space efficient package manager
- **PNPM Workspaces** - Monorepo package management
- **Shared Contracts** - Type-safe API contracts between services

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PNPM** (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swr-bff-mono.git
   cd swr-bff-mono
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

### 🖥 Running the Project

To run the full application, you need to start 3 services in separate terminals:

#### Terminal 1: Mock API Server
```bash
cd apps/api
pnpm dev
```
This starts the JSON server on `http://localhost:3002`

#### Terminal 2: BFF Server
```bash
cd apps/bff
pnpm dev
```
This starts the Fastify BFF server on `http://localhost:3001`

#### Terminal 3: Web Application
```bash
cd apps/web
pnpm dev
```
This starts the React app on `http://localhost:5173`

### 🌐 Access the Application

Open your browser and navigate to:
**http://localhost:5173**

## 📁 Project Structure

```
swr-bff-mono/
├── apps/
│   ├── api/          # JSON Server (Mock API)
│   ├── bff/          # Fastify Backend for Frontend
│   └── web/          # React Frontend
├── packages/
│   └── contracts/    # Shared TypeScript contracts
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Key Components

- **`apps/web/src/features/users/`** - User management components
- **`apps/bff/src/server.ts`** - BFF API routes and business logic
- **`apps/api/db.json`** - Mock database for JSON server
- **`packages/contracts/src/`** - Shared type definitions and schemas

## ✨ Features

- **User Management**: Create, read, update, and delete users
- **Type Safety**: End-to-end type safety with shared contracts
- **Data Fetching**: Optimistic updates and caching with SWR
- **Modern UI**: Material Design components with responsive layout
- **API Validation**: Request/response validation with Zod schemas
- **Development Experience**: Hot reload across all services

## 🛡 API Endpoints

### BFF Server (http://localhost:3001)
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔧 Development Scripts

- `pnpm dev` - Start all services in parallel
- `pnpm dev:web` - Start only the web application
- `pnpm build` - Build all applications
- `pnpm lint` - Run ESLint on web application

## 📦 Packages

- **`@acme/contracts`** - Shared TypeScript contracts and Zod schemas
- **`@acme/api`** - JSON Server mock API
- **`@acme/bff`** - Fastify Backend for Frontend
- **`web`** - React frontend application

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# EFV Monorepo

A monorepo containing multiple applications for the EFV project.

## Project Structure

```
efv-monorepo/
├── apps/
│   ├── efv-api/                  # Go API backend with mock data
│   └── eligibility-checker-ui/   # React frontend application
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Applications

### 1. EFV API (`apps/efv-api`)

A RESTful API built with Go for serving mock data.

**Tech Stack:**
- Go 1.21+
- Gorilla Mux (HTTP router)

**Quick Start:**
```bash
cd apps/efv-api
go mod download
go run main.go
```

Server runs on: `http://localhost:8080`

[View detailed documentation](./apps/efv-api/README.md)

### 2. Eligibility Checker UI (`apps/eligibility-checker-ui`)

A modern React application built with TypeScript and Vite.

**Tech Stack:**
- React 18
- TypeScript
- Vite
- React Router

**Quick Start:**
```bash
cd apps/eligibility-checker-ui
npm install
npm run dev
```

Application runs on: `http://localhost:3000`

[View detailed documentation](./apps/eligibility-checker-ui/README.md)

## Getting Started

### Prerequisites

- **Go**: Version 1.21 or higher
- **Node.js**: Version 18 or higher
- **npm/yarn/pnpm**: Package manager for JavaScript

### Initial Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd efv-monorepo
```

2. Set up the EFV API:
```bash
cd apps/efv-api
go mod download
```

3. Set up the Eligibility Checker UI:
```bash
cd apps/eligibility-checker-ui
npm install
```

## Development

### Running Both Applications

Open two terminal windows:

**Terminal 1 - EFV API:**
```bash
cd apps/efv-api
go run main.go
```

**Terminal 2 - Eligibility Checker UI:**
```bash
cd apps/eligibility-checker-ui
npm run dev
```

## Building for Production

### EFV API

```bash
cd apps/efv-api
go build -o api-server main.go
```

### Eligibility Checker UI

```bash
cd apps/eligibility-checker-ui
npm run build
```

## Project Guidelines

- Each application maintains its own dependencies and configuration
- Shared code should be placed in appropriate packages
- Follow the established project structure within each app
- Keep the root level clean and organized

## Contributing

1. Create a feature branch from `main`
2. Make your changes in the appropriate app directory
3. Test your changes locally
4. Submit a pull request

## License

[Add your license here]

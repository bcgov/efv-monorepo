# EFV Monorepo
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


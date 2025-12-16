# EFV API

A RESTful API built with Go for serving mock data.

## Structure

```
efv-api/
├── main.go                 # Application entry point
├── go.mod                  # Go module dependencies
├── internal/               # Internal application code
│   ├── handlers/          # HTTP request handlers
│   ├── models/            # Data models
│   ├── router/            # HTTP router setup
│   └── services/          # Business logic
└── mock/                  # Mock data files
```

## Getting Started

### Prerequisites

- Go 1.21 or higher

### Installation

```bash
cd apps/efv-api
go mod download
```

### Running the Application

```bash
go run main.go
```

The server will start on `http://localhost:8080`

### Building

```bash
go build -o api-server main.go
```

## API Endpoints

(To be documented as endpoints are implemented)

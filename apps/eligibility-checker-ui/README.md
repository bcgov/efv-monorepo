# Eligibility Checker UI

A modern React application built with TypeScript and Vite.

## Structure

```
eligibility-checker-ui/
├── index.html              # HTML entry point
├── package.json            # Node dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── src/
    ├── main.tsx            # Application entry point
    ├── App.tsx             # Main App component
    ├── App.css             # App styles
    ├── index.css           # Global styles
    ├── components/         # Reusable components
    ├── pages/              # Page components
    ├── services/           # API services
    └── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
cd apps/eligibility-checker-ui
npm install
```

### Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Technologies

- React 18
- TypeScript
- Vite
- React Router

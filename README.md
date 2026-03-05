# BTC Guess Game

A real-time Bitcoin price prediction game built with React, TypeScript, and AWS services. Users authenticate with AWS Cognito and compete by guessing whether Bitcoin's price will go up or down in the next 60 seconds.

## 🏗️ Project Structure

This is a monorepo managed with Turborepo and pnpm workspaces, following **Feature-Sliced Design (FSD)** architecture principles.

```
├── apps/
│   ├── btc-guess-web/          # React frontend application
│   │   └── src/
│   │       ├── features/        # Feature-sliced modules
│   │       │   ├── auth/        # AWS Cognito authentication
│   │       │   │   ├── api/     # Auth API calls (Amplify)
│   │       │   │   ├── config/  # Cognito configuration
│   │       │   │   ├── model/   # Auth state & context
│   │       │   │   ├── ui/      # Auth UI components
│   │       │   │   └── index.ts # Public exports
│   │       │   ├── btc-price/   # Bitcoin price display
│   │       │   ├── guess-game/  # Game mechanics
│   │       │   ├── guess-history/# Game history
│   │       │   └── player/      # Player management
│   │       ├── pages/           # Page components
│   │       ├── shared/          # Shared utilities
│   │       └── components/      # Reusable UI (shadcn)
│   │
│   └── btc-guess-api/           # AWS Lambda backend
│       └── src/
│           ├── handlers/        # Lambda function handlers
│           │   ├── createPlayer.ts
│           │   ├── getPlayer.ts
│           │   ├── submitGuess.ts
│           │   ├── resolveGuess.ts
│           │   ├── getGuesses.ts
│           │   └── getBTCPrice.ts
│           └── utils/           # Shared utilities
│
└── packages/
    └── shared-types/            # Shared TypeScript types
```

## 🎯 Feature-Sliced Design Architecture

Each feature is organized as a self-contained module with clear responsibilities:

### Feature Structure

```
feature/
├── api/          # API calls and external data fetching
├── config/       # Feature-specific configuration
├── model/        # Business logic, state management, hooks
├── ui/           # React components
└── index.ts      # Public API (exports only what's needed)
```

### Key Features

#### 🔐 Authentication (`features/auth/`)

- **AWS Cognito** integration using AWS Amplify v6
- Email/password authentication with verification
- JWT-based session management
- Protected routes
- Cross-device session sync using Cognito user ID

#### 🎮 Game (`features/guess-game/`)

- Real-time countdown timer
- Submit "up" or "down" predictions
- Handles active guess state
- Resume countdown on page refresh

#### 📊 Player (`features/player/`)

- **Optimized player management**
- Cognito userId → playerId mapping
- Single API call on load (`createPlayer` returns full data)
- Score tracking and persistence

#### 📈 BTC Price (`features/btc-price/`)

- Live Bitcoin price display
- Polling mechanism for updates

#### 📜 History (`features/guess-history/`)

- Game history tracking
- Result visualization
- Real-time updates via polling

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **AWS Amplify v6** - Cognito authentication
- **Zustand** - State management
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

### Backend

- **AWS Lambda** - Serverless functions
- **AWS DynamoDB** - Database
- **AWS Step Functions** - 60s delay orchestration
- **AWS API Gateway** - REST API
- **Serverless Framework** - Infrastructure as Code

### Shared

- **Turborepo** - Monorepo management
- **pnpm** - Package manager
- **TypeScript** - Shared types package

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- AWS Account (for Cognito setup)

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Setup

Both applications require environment variables to be configured before running.

#### Backend API (`apps/btc-guess-api/`)

Create a `.env` file in `apps/btc-guess-api/` based on `.env.example`:

```bash
# AWS Credentials (for local development and deployment)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# CoinGecko API Key (optional - free tier available)
# Sign up at https://www.coingecko.com/en/api
# Free tier: 10,000 requests/month
COINGECKO_API_KEY=your-coingecko-api-key
```

**Setup Instructions:**

1. Get AWS credentials from your AWS IAM console
2. (Optional) Sign up for a CoinGecko API key at [https://www.coingecko.com/en/api](https://www.coingecko.com/en/api)
3. Copy `.env.example` to `.env` and fill in your values

#### Frontend Web App (`apps/btc-guess-web/`)

Create a `.env` file in `apps/btc-guess-web/` based on `.env.example`:

```bash
# API Base URL (from backend deployment)
# Use API Gateway URL: https://xxxxx.execute-api.region.amazonaws.com/stage
# Or custom domain: https://api.yourdomain.com
VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev

# AWS Cognito Configuration
# Get these values from your AWS Cognito User Pool
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
```

**Setup Instructions:**

1. Deploy the backend API first to get the API Gateway URL
2. Create an AWS Cognito User Pool in AWS Console
3. Get the User Pool ID and Client ID from Cognito
4. Copy `.env.example` to `.env` and fill in your values

**Note:** All frontend environment variables must be prefixed with `VITE_` to be accessible in the Vite application.

### Running the Application

#### Backend Deployment

The backend **must be deployed to AWS** for local testing as it relies on:

- AWS Lambda functions for API endpoints
- AWS Step Functions for the 60-second guess resolution delay
- AWS DynamoDB for data persistence

There is no local emulation. Deploy the backend first using the Serverless Framework:

```bash
cd apps/btc-guess-api
pnpm deploy:dev or pnpm deploy:prod
```

After deployment, copy the API Gateway URL from the output and add it to your frontend `.env` file.

#### Frontend Development

Once the backend is deployed and your `.env` file is configured with actual values, start the frontend development server:

```bash
# From the frontend directory
cd apps/btc-guess-web
pnpm dev
```

The frontend will be available at `http://localhost:5173` and will connect to your deployed AWS backend.

`Note: Once you Sign Up, please verify your account with the verification link in your provided email.`

#### Frontend Deployment

To build the frontend for production deployment:

```bash
# From the frontend directory
cd apps/btc-guess-web
pnpm build
```

This will create optimized production files in the `dist/` folder. The built files can be deployed to any static hosting service:

- **AWS S3 + CloudFront** - Static website hosting with CDN
- **Vercel** - Zero-config deployment
- **Netlify** - Drag-and-drop or CLI deployment
- **AWS Amplify** - Full-stack deployment
- **Any static hosting service** - Just upload the `dist/` folder contents

**Example deployment to S3:**

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```


# VAT Management and IRD Submission System

A comprehensive SaaS platform for managing VAT compliance and IRD submissions for Sri Lankan companies. This monorepo contains the complete backend API and shared packages.

## 🏗️ Project Structure

```
.
├── apps/
│   └── api/                 # NestJS Backend API
│       ├── src/
│       │   ├── config/      # Configuration modules
│       │   ├── modules/     # Feature modules
│       │   ├── schemas/     # MongoDB schemas
│       │   └── common/      # Shared resources
│       ├── test/            # E2E tests
│       └── README.md        # API documentation
│
├── packages/
│   └── shared/              # Shared packages
│       └── src/
│           ├── constants/   # Enums, constants
│           ├── types/       # TypeScript interfaces
│           ├── validators/  # Validation functions
│           └── utils/       # Utility functions
│
├── docker-compose.yml       # Local development services
├── turbo.json              # TurboRepo configuration
└── package.json            # Root package configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose (for local services)

### Installation

```bash
# Install dependencies
npm install

# Start local services (MongoDB, Redis)
docker-compose up -d

# Start development server
npm run dev
```

The API will be available at:
- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## 📦 Workspaces

This is a TurboRepo monorepo with the following workspaces:

### `/apps/api` - NestJS Backend API

Complete REST API with:
- Authentication & Authorization (JWT + 2FA)
- Company Management
- File Uploads (Firebase Storage)
- Server-Side Mapping (QuickBooks, Xero, Tally, etc.)
- Notifications (Email + WebSocket)
- Swagger Documentation

[Full API Documentation →](./apps/api/README.md)

### `/packages/shared` - Shared Core Package

Shared types, constants, validators, and utilities used across the application:
- Enums (UserRole, EntityStatus, SubmissionStage, etc.)
- TypeScript interfaces
- Validation functions
- Utility functions

## 🛠️ Available Scripts

### Root Level

```bash
# Development
npm run dev              # Start all apps in development mode
npm run build            # Build all apps
npm run test             # Run tests across all workspaces
npm run lint             # Lint all workspaces
npm run format           # Format code with Prettier
npm run clean            # Clean all workspaces

# Type checking
npm run type-check       # Type check all workspaces
```

### API Specific

```bash
cd apps/api

npm run dev              # Start API with hot reload
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run unit tests
npm run test:cov         # Test with coverage
npm run test:e2e         # E2E tests
npm run lint             # Run ESLint
```

## 🐳 Docker Support

The project includes Docker Compose for local development:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f mongodb
```

Services included:
- MongoDB (port 27017)
- MongoDB Test (port 27018)
- Redis (port 6379)

## 📚 Documentation

- [API Documentation](./apps/api/README.md) - Complete API setup and usage guide
- [Swagger UI](http://localhost:3000/api/docs) - Interactive API documentation
- [Product Requirements](./prd.md) - Detailed product specifications

## 🔧 Environment Configuration

Create `.env` file in `apps/api/`:

```bash
cp apps/api/.env.example apps/api/.env
```

Required environment variables:
- MongoDB connection string
- JWT secrets
- Firebase credentials
- SMTP configuration

See [apps/api/.env.example](./apps/api/.env.example) for all options.

## 🧪 Testing

```bash
# Run all tests
npm run test

# API unit tests
cd apps/api && npm run test

# API with coverage
cd apps/api && npm run test:cov

# E2E tests
cd apps/api && npm run test:e2e
```

## 📊 Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + 2FA (TOTP + Email OTP)
- **Storage**: Firebase Storage
- **Real-time**: Socket.io
- **Email**: Nodemailer (SMTP)
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Testing**: Jest

### Shared
- TypeScript
- class-validator
- class-transformer

### DevOps
- TurboRepo (monorepo)
- Docker & Docker Compose
- ESLint & Prettier

## 🏛️ Architecture

### Monorepo Structure
- **TurboRepo** for efficient builds and caching
- **Shared packages** for code reuse
- **Independent deployments** for each app

### API Architecture
- **Modular design** with NestJS modules
- **MongoDB** for flexible document storage
- **Firebase Storage** for file management
- **WebSocket** for real-time notifications
- **SMTP** for email notifications

### Security
- Password hashing with bcrypt
- JWT access and refresh tokens
- 2FA support (TOTP + Email OTP)
- Role-based access control (RBAC)
- Account lockout protection
- Input validation on all endpoints

## 📈 Features

### ✅ Implemented

- [x] User authentication & authorization
- [x] JWT + 2FA (TOTP & Email OTP)
- [x] Company registration & management
- [x] TIN validation
- [x] File upload to Firebase Storage
- [x] CSV/Excel file handling
- [x] Server-side mapping templates
- [x] Automatic system detection
- [x] Email notifications (SMTP)
- [x] In-app real-time notifications (WebSocket)
- [x] Swagger documentation
- [x] Health check endpoint
- [x] Docker development environment

### 🔄 Planned

- [ ] VAT calculation engine
- [ ] IRD schedule generation (01-07)
- [ ] Amendment schedules
- [ ] IRD submission automation
- [ ] Payment integration (Stripe/PayHere)
- [ ] Audit trail
- [ ] Report generation
- [ ] CRM module for VAT team
- [ ] Client portal UI
- [ ] Mobile app

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `npm run test`
4. Run linter: `npm run lint`
5. Format code: `npm run format`
6. Commit with descriptive message
7. Create a pull request

## 📄 License

Proprietary - Simplebooks VAT Management System

## 📞 Support

- **Documentation**: http://localhost:3000/api/docs
- **Health Status**: http://localhost:3000/api/health
- **Email**: support@vatmanagement.lk

## 🎯 Getting Started Guide

### 1. Clone and Install

```bash
git clone <repository-url>
cd vat-management-system
npm install
```

### 2. Setup Environment

```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your configuration
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Run Application

```bash
npm run dev
```

### 5. Access Application

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Health: http://localhost:3000/api/health

### 6. Test API

Import the Postman collection: `apps/api/postman-collection.json`

Or use Swagger UI for interactive testing.

## 🔍 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Port Already in Use

```bash
# Change PORT in apps/api/.env
PORT=3001
```

### Firebase Issues

Make sure Firebase credentials are properly configured in `.env`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_STORAGE_BUCKET=your-bucket
```

## 📝 Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Develop**: Make changes and test locally
3. **Test**: `npm run test`
4. **Lint**: `npm run lint`
5. **Type Check**: `npm run type-check`
6. **Commit**: `git commit -m "feat: your feature"`
7. **Push**: `git push origin feature/your-feature`
8. **Pull Request**: Create PR to `main`

## 🎓 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TurboRepo Documentation](https://turbo.build/repo/docs)

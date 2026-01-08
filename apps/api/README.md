# VAT Management System - Backend API

A comprehensive NestJS-based REST API for managing VAT compliance and IRD submissions for Sri Lankan companies.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - 2FA support (TOTP + Email OTP)
  - Role-based access control (RBAC)
  - Password hashing with bcrypt
  - Account lockout after failed login attempts

- **Company Management**
  - Company registration with TIN validation
  - Company profile management
  - Multi-company support

- **File Uploads**
  - Firebase Storage integration
  - CSV/Excel file upload support
  - File validation (size, type, format)
  - Signed URL generation for secure downloads

- **Server-Side Mapping**
  - Pre-defined templates for QuickBooks, Xero, Tally, ClearTax, Zoho
  - Custom mapping template creation
  - Automatic system detection from CSV/Excel headers
  - Column mapping to canonical fields

- **Notifications**
  - Email notifications via SMTP
  - Real-time in-app notifications via WebSocket (Socket.io)
  - Notification history and management

- **API Documentation**
  - Complete Swagger/OpenAPI documentation
  - Interactive API explorer at `/api/docs`
  - Request/response examples for all endpoints

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB >= 7.0
- Firebase account (for file storage)
- SMTP server credentials (for email notifications)

## 🛠️ Installation

### 1. Install Dependencies

```bash
# From the root directory
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cd apps/api
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/vat-management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@vatmanagement.lk
```

### 3. Start Local Services

Start MongoDB and other services using Docker Compose:

```bash
# From the root directory
docker-compose up -d
```

This will start:
- MongoDB (port 27017)
- MongoDB Test (port 27018)
- Redis (port 6379)

## 🏃 Running the Application

### Development Mode (with hot reload)

```bash
# From the root directory
npm run dev

# Or from the apps/api directory
cd apps/api
npm run dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📚 API Documentation

Once the server is running, access the API documentation:

- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json
- **Health Check**: http://localhost:3000/api/health

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── config/              # Configuration modules
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── firebase.config.ts
│   │   ├── email.config.ts
│   │   └── stripe.config.ts
│   ├── common/              # Shared resources
│   │   ├── decorators/      # Custom decorators (@Public, @CurrentUser, @Roles)
│   │   ├── guards/          # Auth guards (JWT, Roles)
│   │   ├── filters/         # Exception filters
│   │   ├── interceptors/    # Logging, Transform interceptors
│   │   └── pipes/           # Validation pipes
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── companies/       # Company management
│   │   ├── uploads/         # File upload (Firebase)
│   │   ├── mapping/         # Server-side mapping
│   │   ├── notifications/   # Email + WebSocket notifications
│   │   └── health/          # Health check
│   ├── schemas/             # Mongoose schemas
│   │   ├── user.schema.ts
│   │   ├── company.schema.ts
│   │   ├── upload.schema.ts
│   │   ├── mapping-template.schema.ts
│   │   └── notification.schema.ts
│   ├── app.module.ts        # Root application module
│   └── main.ts              # Application bootstrap
├── test/                    # E2E tests
├── .env.example             # Environment variables template
├── nest-cli.json            # NestJS CLI configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🔐 Authentication

### Register a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "P@ssw0rd123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "COMPANY_USER"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "P@ssw0rd123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "COMPANY_USER"
    }
  }
}
```

### Use Bearer Token

Add the access token to all authenticated requests:

```bash
Authorization: Bearer <access_token>
```

## 📦 Key Endpoints

### Companies

- `POST /api/companies/register` - Register a new company
- `GET /api/companies` - Get all companies (paginated)
- `GET /api/companies/:id` - Get company by ID
- `PATCH /api/companies/:id` - Update company profile
- `POST /api/companies/validate-tin` - Validate TIN format

### Uploads

- `POST /api/uploads/file` - Upload CSV/Excel file
- `GET /api/uploads/company/:companyId` - Get uploads for a company
- `GET /api/uploads/:id` - Get upload details
- `GET /api/uploads/:id/url` - Get signed download URL
- `DELETE /api/uploads/:id` - Delete uploaded file

### Mapping

- `POST /api/mapping/seed-defaults` - Seed default mapping templates
- `POST /api/mapping/templates` - Create custom mapping template
- `GET /api/mapping/templates` - Get all mapping templates
- `POST /api/mapping/detect` - Detect system type from headers
- `GET /api/mapping/canonical-fields` - Get canonical field definitions

### Notifications

- `GET /api/notifications` - Get user notifications (paginated)
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

## 🌐 WebSocket Events

Connect to WebSocket at: `ws://localhost:3000/notifications`

### Client Events

```javascript
// Register user for notifications
socket.emit('register', { userId: 'user-id' });

// Join company room
socket.emit('joinCompany', { companyId: 'company-id' });

// Leave company room
socket.emit('leaveCompany', { companyId: 'company-id' });
```

### Server Events

```javascript
// New notification
socket.on('notification', (data) => {
  console.log('New notification:', data);
});

// Registration confirmation
socket.on('registered', (data) => {
  console.log('Registered:', data);
});
```

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start with hot reload
npm run start:debug      # Start with debugger

# Build
npm run build            # Build for production
npm run prebuild         # Clean dist folder

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run unit tests
npm run test:cov         # Test with coverage
npm run test:watch       # Watch mode
npm run test:e2e         # E2E tests

# Clean
npm run clean            # Remove dist folder
```

## 🏗️ Shared Packages

The API uses shared packages from `@shared/core`:

```typescript
import { UserRole, EntityStatus } from '@shared/constants';
import { validateTIN, validateEmail } from '@shared/validators';
import { formatCurrency, calculateVAT } from '@shared/utils';
import { IUser, ICompany, ApiResponse } from '@shared/types';
```

## 🐳 Docker Support

The project includes Docker Compose for local development:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## 📝 Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-08T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [...]
  },
  "timestamp": "2024-01-08T10:30:00.000Z",
  "path": "/api/companies/register"
}
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- 2FA support (TOTP + Email OTP)
- Account lockout after 5 failed login attempts
- CORS configuration
- Input validation with class-validator
- SQL injection prevention (NoSQL)
- XSS protection

## 📊 Monitoring & Logging

- Winston logger for structured logging
- Request/response logging middleware
- Error logging with stack traces
- Log files: `logs/error.log`, `logs/combined.log`
- Health check endpoint for monitoring

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Run linter: `npm run lint`
5. Commit with descriptive message
6. Create a pull request

## 📄 License

Proprietary - Simplebooks VAT Management System

## 🆘 Support

For support and questions:
- Email: support@vatmanagement.lk
- Documentation: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/health

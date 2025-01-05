# Workout Tracker - Project Initialization Guidelines

## Project Structure

```
workout-tracker/              # Current directory
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication routes
│   │   ├── exercises/       # Exercise management
│   │   └── workouts/        # Workout management
│   ├── exercises/           # Exercise pages
│   ├── workouts/            # Workout pages
│   └── layout.tsx           # Root layout
├── components/              
│   ├── ui/                  # Reusable UI components
│   ├── exercises/           # Exercise-specific components
│   └── workouts/           # Workout-specific components
├── lib/                     # Shared utilities
│   ├── prisma/             # Prisma configuration
│   ├── auth/               # Authentication utilities
│   ├── api/                # API utilities
│   ├── logger/             # Logging configuration
│   └── utils/              # Helper functions
├── types/                   # TypeScript type definitions
├── styles/                  # Global styles
├── public/                  # Static assets
└── tests/                   # Test files
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.7.0",
    "@auth/prisma-adapter": "^1.0.0",
    "next-auth": "^4.24.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.0",
    "recharts": "^2.10.0",
    "@tanstack/react-query": "^5.13.0",
    "bcryptjs": "^2.4.3",
    "redis": "^4.6.0",
    "winston": "^3.11.0",
    "class-validator": "^0.14.0",
    "date-fns": "^2.30.0",
    "ioredis": "^5.3.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.49.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "@types/bcryptjs": "^2.4.0",
    "prisma": "^5.7.0",
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@types/jest": "^29.5.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0"
  }
}
```

## Environment Configuration

```env
# .env.local

# Node Environment
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/exercise_tracker"
DATABASE_SSL=false
DATABASE_MAX_CONNECTIONS=20

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="min-64-chars-randomly-generated-secret" # Generate using: openssl rand -base64 64
JWT_SECRET="min-32-chars-randomly-generated-secret" # Generate using: openssl rand -base64 32
JWT_EXPIRY="1h"
REFRESH_TOKEN_EXPIRY="7d"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=""
REDIS_DB=0

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
LOG_FORMAT=development # development | production

# Security
CORS_ORIGINS="http://localhost:3000"
COOKIE_SECRET="min-32-chars-randomly-generated-secret"

# Email (for NextAuth)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@example.com"
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    // Language and Environment
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",

    // Modules
    "module": "esnext",
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,

    // Emit
    "noEmit": true,
    "incremental": true,

    // Interop Constraints
    "allowJs": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    // Projects
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

[Previous content remains the same until Initialization Steps]

## Initialization Steps

1. Create project structure and install dependencies:
   ```bash
   # Create necessary directories
   mkdir -p app/api/{auth,exercises,workouts} \
     components/{ui,exercises,workouts} \
     lib/{prisma,auth,api,logger,utils} \
     types \
     tests \
     logs

   # Install dependencies
   npm install

   # Initialize Git and set up hooks
   git init
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"

   # Generate Prisma client
   npx prisma generate
   ```

2. Configure environment variables:
   ```bash
   # Copy example env file
   cp .env.example .env.local

   # Generate secrets
   echo "NEXTAUTH_SECRET=$(openssl rand -base64 64)" >> .env.local
   echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.local
   echo "COOKIE_SECRET=$(openssl rand -base64 32)" >> .env.local

   # Edit remaining configuration in .env.local
   ```

3. Set up the database and Redis:
   ```bash
   # Start services
   docker-compose up -d db redis

   # Wait for services to be ready
   sleep 5

   # Push schema to database
   npx prisma db push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Verify setup:
   - Visit http://localhost:3000 to check the application
   - Confirm database connection via Prisma Studio: `npx prisma studio`
   - Check Redis connection: `redis-cli ping`
   - Verify logging is working: check logs/combined.log

# Quality Assurance Checklist

### Development Setup
- [ ] TypeScript strict mode enabled
- [ ] ESLint configuration complete
- [ ] Prettier configuration set
- [ ] Git hooks configured
- [ ] Environment variables documented
- [ ] VS Code settings configured

### Database Setup
- [ ] Prisma schema validated
- [ ] Migrations working
- [ ] Indexes properly configured
- [ ] Relations correctly defined

### Authentication
- [ ] NextAuth providers configured
- [ ] Session handling working
- [ ] JWT configuration secure
- [ ] User model complete

### Testing
- [ ] Jest configuration complete
- [ ] Testing utilities set up
- [ ] Example tests created
- [ ] CI pipeline configured

### Security
- [ ] Rate limiting implemented
- [ ] CORS configured
- [ ] Security headers set
- [ ] Input validation in place

### Performance
- [ ] Database indexes created
- [ ] Caching strategy defined
- [ ] API rate limiting configured
- [ ] Bundle optimization setup

### Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring setup
- [ ] API monitoring ready
- [ ] Error boundaries implemented

## Additional Resources

1. Documentation files to create:
   - README.md
   - CONTRIBUTING.md
   - SECURITY.md
   - CHANGELOG.md

2. GitHub templates:
   - Issue templates
   - PR templates
   - Bug report template
   - Feature request template

3. CI/CD workflows:
   - Build and test workflow
   - Deployment workflow
   - Security scanning workflow

4. Development guidelines:
   - Code style guide
   - Git workflow guide
   - Testing guidelines
   - API documentation

Follow these guidelines to ensure a consistent, maintainable, and secure project setup.
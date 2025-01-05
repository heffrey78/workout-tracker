#!/bin/bash

# Create necessary directories
echo "Creating project structure..."
mkdir -p app/api/{auth,exercises,workouts} \
  components/{ui,exercises,workouts} \
  lib/{prisma,auth,api,logger,utils} \
  types \
  tests

# Install dependencies
echo "Installing dependencies..."
npm install next@^14.0.0 react@^18.2.0 react-dom@^18.2.0 @prisma/client@^5.7.0 \
  @auth/prisma-adapter@^1.0.0 next-auth@^4.24.0 zod@^3.22.0 lucide-react@^0.294.0 \
  tailwindcss@^3.3.0 recharts@^2.10.0 @tanstack/react-query@^5.13.0 bcryptjs@^2.4.3 \
  redis@^4.6.0 winston@^3.11.0 class-validator@^0.14.0 date-fns@^2.30.0 ioredis@^5.3.0 \
  @hookform/resolvers@^3.3.0 react-hook-form@^7.49.0

# Install dev dependencies
echo "Installing dev dependencies..."
npm install -D typescript@^5.3.0 @types/react@^18.2.0 @types/node@^20.10.0 \
  @types/bcryptjs@^2.4.0 prisma@^5.7.0 eslint@^8.55.0 jest@^29.7.0 \
  @testing-library/react@^14.1.0 @testing-library/jest-dom@^6.1.0 @types/jest@^29.5.0 \
  prettier@^3.1.0 husky@^8.0.0 lint-staged@^15.2.0 @typescript-eslint/eslint-plugin@^6.13.0 \
  @typescript-eslint/parser@^6.13.0

# Initialize Prisma
echo "Initializing Prisma..."
npx prisma init

# Set up Git hooks
echo "Setting up Git hooks..."
git init
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

echo "Setup completed successfully!"

# Workout Tracker

A modern web application for tracking workouts and monitoring fitness progress.

## Features

- User authentication with NextAuth.js
- Workout tracking and management
- Exercise library with custom exercises
- Progress monitoring and statistics
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Caching**: Redis
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod
- **Testing**: Jest with React Testing Library
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/workout-tracker.git
   cd workout-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:studio` - Open Prisma Studio

### Project Structure

```
workout-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── exercises/         # Exercise pages
│   └── workouts/         # Workout pages
├── components/            
│   ├── ui/               # Reusable UI components
│   ├── exercises/        # Exercise components
│   └── workouts/        # Workout components
├── lib/                   # Shared utilities
│   ├── prisma/           # Prisma configuration
│   ├── auth/             # Authentication utilities
│   └── utils/            # Helper functions
├── types/                 # TypeScript types
└── tests/                # Test files
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

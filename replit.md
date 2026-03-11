# Project Documentation

## Overview

This is a full-stack web application for managing community projects and connecting contributors. Users can browse active projects, view project details on an interactive calendar and individual shareable project pages, express interest in joining projects, and submit new project proposals for approval. The application features a modern, tech-focused dark theme UI with smooth animations and responsive design.

## Recent Changes

**November 20, 2025**:
- Changed project dates from single date to date range (startDate and endDate)
- Added individual project detail pages with shareable URLs at `/project/:id`
- Updated calendar to highlight all dates within project date ranges
- Made project cards clickable to navigate to detail pages
- Updated forms to collect start and end dates with validation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for fast development and optimized production builds.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible, customizable components styled with Tailwind CSS. The "new-york" style variant is used with a dark-first theme featuring vivid purple accents.

**Routing**: wouter for lightweight client-side routing with routes:
- `/` - Home page with project carousel and calendar
- `/project/:id` - Individual project detail page with shareable URL

**State Management**: 
- TanStack Query (React Query) for server state management with conservative refetch settings (no refetch on window focus, infinite stale time)
- React Hook Form with Zod for form state and validation

**Key Design Patterns**:
- Component composition with shadcn/ui's slot-based approach for flexible component APIs
- Custom hooks for reusable logic (use-mobile, use-toast)
- Controlled forms with schema validation using Zod and react-hook-form
- Path aliasing for clean imports (@/, @shared/, @assets/)

**Visual Features**:
- Dark theme with cyberpunk/tech aesthetic
- Gradient text effects and glow shadows on interactive elements
- Carousel-based project browsing with Embla Carousel
- Interactive calendar with project date range highlighting
- Clickable project cards that navigate to detail pages
- Shareable project detail pages with full information display
- Responsive design with mobile-first approach

### Backend Architecture

**Framework**: Express.js server with TypeScript, running in ESM mode.

**API Design**: RESTful JSON API with routes organized in a centralized router file:
- GET `/api/projects` - Fetch all projects with team members
- GET `/api/projects/:id` - Fetch single project details
- POST `/api/projects/submit` - Submit new project for approval
- POST `/api/projects/:id/interest` - Express interest in joining a project
- Admin routes for managing pending project submissions

**Middleware Stack**:
- JSON body parsing with raw body capture for webhook support
- URL-encoded form data parsing
- Request logging with response time tracking for API routes
- Vite dev server integration in development mode

**Error Handling**: Zod validation errors are converted to friendly error messages using zod-validation-error.

**Development vs Production**:
- Development: Vite middleware for HMR and SSR
- Production: Static file serving from dist/public

### Data Storage

**ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database queries.

**Database Provider**: Neon serverless PostgreSQL accessed via HTTP driver for edge-compatible queries.

**Schema Design**:
- `users` - User accounts with username/password authentication
- `projects` - Approved active projects with team members, startDate, and endDate
- `pendingProjects` - Project submissions awaiting approval with date ranges
- `guildMembers` - Team member associations with projects
- `interestSubmissions` - User expressions of interest in projects

**Key Design Decisions**:
- UUID primary keys using PostgreSQL's gen_random_uuid()
- Array columns for flexible data like resourcesNeeded
- Date ranges (startDate, endDate) to support multi-day projects
- Separate tables for approved vs pending projects to maintain data integrity
- Zod schemas generated from Drizzle schemas for validation

**Storage Layer Pattern**: Repository pattern with IStorage interface and DbStorage implementation for clean separation of data access logic.

### Build and Deployment

**Build Process**:
- Client: Vite builds React app to dist/public
- Server: esbuild bundles Express server to dist/index.js with external packages

**Environment Requirements**:
- DATABASE_URL environment variable for PostgreSQL connection
- Neon database provisioning required before first run

**Development Scripts**:
- `dev` - Start Express server with tsx for TypeScript execution
- `dev:client` - Run Vite dev server on port 5000
- `build` - Build both client and server for production
- `db:push` - Push schema changes to database

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL provider accessed via HTTP driver (@neondatabase/serverless)
- Connection managed through DATABASE_URL environment variable

### UI Component Libraries
- **Radix UI**: Headless component primitives for accessibility (@radix-ui/react-*)
- **shadcn/ui**: Pre-styled component system built on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Form and Validation
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod
- **drizzle-zod**: Generate Zod schemas from Drizzle table definitions

### Styling
- **Tailwind CSS**: Utility-first CSS framework via @tailwindcss/vite plugin
- **class-variance-authority**: Type-safe component variant system
- **clsx & tailwind-merge**: Utility for conditional class merging

### Data Fetching
- **TanStack Query**: Async state management for server data with caching and background updates

### Development Tools
- **Vite**: Build tool and dev server with React plugin
- **tsx**: TypeScript execution for Node.js in development
- **esbuild**: Fast JavaScript bundler for production server build
- **Replit Plugins**: Development experience enhancements (error modal, cartographer, dev banner)

### UI Enhancement Libraries
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel/slider functionality
- **cmdk**: Command menu component
- **vaul**: Drawer component primitives
- **react-day-picker**: Calendar component
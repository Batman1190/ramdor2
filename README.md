# Ramdor2 Video Platform

A modern video sharing platform built with Neon Database for data storage and bunny.net for video hosting.

## Features

- User Authentication System
- Video Upload and Management
- Video View Counter
- Likes, Comments, and Subscriptions
- Search and Filtering
- Personalized Feed/Home Page

## Tech Stack

- Frontend: Vanilla JavaScript with Vite
- Database: Neon (PostgreSQL)
- ORM: Drizzle
- Video Hosting: bunny.net
- Authentication: JWT

## Prerequisites

- Node.js (v16 or higher)
- Neon Database account
- bunny.net account with Video Stream library

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables in `.env`:
   - `DATABASE_URL`: Your Neon database connection string
   - `BUNNY_API_KEY`: Your bunny.net API key
   - `BUNNY_LIBRARY_ID`: Your bunny.net library ID
   - `BUNNY_HOSTNAME`: Your bunny.net hostname
   - `JWT_SECRET`: A secure random string for JWT signing

## Development

Start the development server:
```bash
npm run dev
```

## Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Database Schema

### Users
- id (UUID)
- username (unique)
- email (unique)
- password (hashed)
- created_at

### Videos
- id (UUID)
- title
- description
- user_id (foreign key)
- bunny_video_id
- views
- created_at

### Likes
- id (UUID)
- user_id (foreign key)
- video_id (foreign key)
- created_at

### Comments
- id (UUID)
- content
- user_id (foreign key)
- video_id (foreign key)
- created_at

### Subscriptions
- id (UUID)
- subscriber_id (foreign key)
- channel_id (foreign key)
- created_at
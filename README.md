# Privacy-Focused Todo App

A self-hosted, real-time collaborative todo list application built with Next.js 14+, focusing on privacy and simplicity.

## Features

- 🔒 Privacy-focused and self-hosted
- ⚡ Real-time updates for collaborative tasks
- 📱 Responsive design for all devices
- 🗂️ Hierarchical list organization
- 📅 Calendar view for task visualization
- 🔔 Browser and email notifications
- 🎯 Task prioritization and tagging

## Tech Stack

- **Frontend**: Next.js 14+, TailwindCSS, React DnD
- **Backend**: Next.js API routes, Prisma
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Real-time**: Pusher/Socket.io
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for local development)
- PostgreSQL (or Docker container)

### Development Setup

1. Clone the repository
```bash
git clone https://github.com/Alan-crt/todo-app.git
cd todo-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

- `/src/app`: Next.js 14+ app directory structure
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and shared logic
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/tests`: Unit and integration tests


## License

MIT License - See LICENSE file for details
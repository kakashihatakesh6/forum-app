# Forum App

A full-stack Next.js web application where users can sign up, create forums, and interact through comments/questions. Similar to GitHub Discussions, this application allows community discussions in an organized manner.

## Features

- User authentication with Next Auth
- Create and browse forums
- Create posts in forums
- Comment on posts with threaded replies
- Responsive design

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma with SQLite
- **UI Components**: Tailwind Forms

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd forum-app
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up the database
```bash
npx prisma migrate dev --name init
# This will create your SQLite database and apply migrations
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

For production, make sure to change the `NEXTAUTH_SECRET` to a strong, unique value.

## Deployment

Build the application for production:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

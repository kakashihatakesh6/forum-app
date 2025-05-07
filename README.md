# Forum App

A full-stack Next.js-powered discussion platform where users can sign up, create forums, post discussions, and interact through comments. Similar to GitHub Discussions, this application enables organized community conversations in a modern, responsive interface.

![Forum App](https://placehold.co/600x400?text=Forum+App&font=montserrat)

## ✨ Features

- **User Authentication** - Secure login/signup with JWT and Next Auth
- **Forum Creation** - Create topic-specific discussion spaces with descriptions and tags
- **Post Management** - Create, read, update, and delete posts within forums
- **Threaded Comments** - Engage in discussions with nested comment replies
- **Responsive Design** - Beautiful UI that works on mobile, tablet, and desktop
- **Dark/Light Modes** - Support for theme preferences using next-themes
- **Modern Stack** - Built with Next.js 15, React 19, and Tailwind CSS 4

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Date Formatting**: [date-fns](https://date-fns.org/)
- **Utility Libraries**: clsx, tailwind-merge

### Backend
- **Database ORM**: [Prisma](https://prisma.io/) with MongoDB
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Password Hashing**: bcrypt

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database (local or MongoDB Atlas)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/forum-app.git
cd forum-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with:

```
# MongoDB URI (replace with your actual MongoDB connection string)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/forum-app?retryWrites=true&w=majority"

# NextAuth configuration
NEXTAUTH_SECRET="your-secure-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize the database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

### 6. Open your browser

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Available Scripts

- `npm run dev` - Start development server with turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📚 Project Structure

```
forum-app/
├── prisma/                   # Prisma schema and migrations
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── forum/            # Forum page components
│   │   ├── forums/           # Forums listing components
│   │   ├── signin/           # Authentication pages
│   │   ├── signup/           # Registration pages
│   │   └── ...               # Other page components
│   ├── components/           # Reusable React components
│   ├── lib/                  # Utility functions and configurations
│   ├── models/               # Data models
│   ├── providers/            # Context providers
│   └── types/                # TypeScript type definitions
├── .env                      # Environment variables (create this)
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🔒 Authentication

The application uses NextAuth.js with a credentials provider for authentication. Users can:

1. Sign up with email/password
2. Sign in with their credentials
3. Maintain persistent sessions

Password security is handled with bcrypt for secure password hashing.

## 🌐 Deployment

### Build for production

```bash
npm run build
# or
yarn build
```

### Start the production server

```bash
npm start
# or
yarn start
```

### Deployment Platforms

This application can be deployed to:

- [Vercel](https://vercel.com/) (recommended for Next.js apps)
- [Netlify](https://netlify.com/)
- [Railway](https://railway.app/)
- Any Node.js hosting environment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js and MongoDB

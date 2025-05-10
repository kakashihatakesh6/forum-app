<div align="center">
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" alt="Forum App Logo" width="80">
  <h1>Forum App</h1>
  <p><strong>A modern, feature-rich discussion platform built with Next.js 15</strong></p>
  <img src="https://img.shields.io/badge/next.js-15.3.2-blue?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/react-19.0.0-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/tailwindcss-4.0.0-blue?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/prisma-6.7.0-blue?style=flat-square&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
</div>

<p align="center">
  <img src="https://placehold.co/800x400?text=Forum+App+Screenshot&font=montserrat" alt="Forum App Demo" width="100%">
</p>

## ✨ Overview

Forum App is a full-stack Next.js-powered discussion platform where users can sign up, create forums, post discussions, and interact through comments. Similar to GitHub Discussions, this application enables organized community conversations in a modern, responsive interface.

### 🌟 Key Features

- **Secure Authentication** - Sign up/login with JWT and NextAuth.js
- **Forum Management** - Create and browse topic-specific discussion spaces
- **Rich Discussion System** - Create posts and engage with threaded comments
- **Responsive Design** - Beautiful UI that adapts to all devices
- **Dark/Light Themes** - Visual preference support with next-themes
- **Real-time Updates** - Modern UI with smooth transitions
- **Profile Management** - User profiles with activity history

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/forum-app.git
   cd forum-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory:
   ```
   # MongoDB URI
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/forum-app?retryWrites=true&w=majority"
   
   # NextAuth configuration
   NEXTAUTH_SECRET="your-secure-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**  
   Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Utility Libraries**: clsx, tailwind-merge

### Backend
- **API Routes**: Next.js API Routes with App Router
- **Database**: MongoDB
- **ORM**: [Prisma](https://prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Password Security**: bcrypt

## 📚 Project Structure

```
forum-app/
├── prisma/                   # Prisma schema and database configuration
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes for forums, posts, comments
│   │   ├── forum/            # Forum view pages
│   │   ├── forums/           # Forums listing pages
│   │   ├── create-forum/     # Forum creation page
│   │   ├── profile/          # User profile pages
│   │   ├── signin/           # Authentication pages
│   │   ├── signup/           # Registration pages
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable React components
│   │   ├── Navbar.tsx        # Navigation component
│   │   ├── ForumsList.tsx    # Forums display component
│   │   ├── CommentSection.tsx # Comments functionality
│   │   └── ...               # Other UI components
│   ├── lib/                  # Utility functions and configurations
│   ├── models/               # Data models
│   ├── providers/            # Context providers
│   └── types/                # TypeScript type definitions
```

## 🧩 Core Features

### Authentication System
- Email/password registration and login
- Secure session management with NextAuth.js
- Protected routes for authenticated users

### Forums
- Create topic-specific discussion spaces
- Categorize forums with tags
- Browse forums with filtering options

### Posts & Comments
- Create and edit posts within forums
- Rich text content support
- Nested comment threads with replies
- Real-time comment updates

### User Profiles
- View user post and comment history
- Profile customization options
- Activity tracking

## 🔍 Database Schema

The application uses Prisma with MongoDB for data storage:

- **User** - User accounts and profile information
- **Forum** - Discussion categories with metadata
- **Post** - Individual discussion threads within forums
- **Comment** - Responses to posts, supporting nested replies
- **Account/Session** - NextAuth.js authentication data

## 🚀 Deployment

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

### Recommended Hosting Options
- [Vercel](https://vercel.com/) (optimized for Next.js)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) (for database)

## 📱 Responsive Design

The Forum App is designed to work beautifully on:
- Desktops and laptops
- Tablets
- Mobile devices

With a responsive layout that adapts to screen size, users can enjoy a consistent experience across devices.

## 🛣️ Roadmap

- [ ] Real-time notifications
- [ ] Image uploading in posts and comments
- [ ] Forum subscription system
- [ ] Social authentication options (Google, GitHub)
- [ ] Advanced user roles and permissions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [MongoDB](https://www.mongodb.com/) - Document database
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

---

<div align="center">
  <p>Built with ❤️ using Next.js, React, and MongoDB</p>
</div>

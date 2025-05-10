import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ForumSkeleton from "@/components/ForumSkeleton";

// Define types
type Creator = {
  name: string | null;
  email: string;
}

type Forum = {
  id: string;
  title: string;
  description: string | null;
  creator: Creator;
  _count: {
    posts: number;
  };
}

// Sample dummy forums for empty state
const dummyForums: Forum[] = [
  {
    id: "dummy1",
    title: "Welcome to the Community",
    description: "Introduce yourself and connect with other members",
    creator: { name: "Admin", email: "admin@example.com" },
    _count: { posts: 12 },
  },
  {
    id: "dummy2",
    title: "Tech Discussion",
    description: "Share thoughts on the latest technology trends",
    creator: { name: "TechGuru", email: "tech@example.com" },
    _count: { posts: 8 },
  },
  {
    id: "dummy3",
    title: "Development Best Practices",
    description: "Discussion on coding standards and practices",
    creator: { name: "DevMaster", email: "dev@example.com" },
    _count: { posts: 15 },
  },
];

function ForumsList({ forums }: { forums: Forum[] }) {
  return (
    <ul className="divide-y divide-border">
      {forums.map((forum) => (
        <li 
          key={forum.id} 
          className="px-6 py-5 hover:bg-muted/50 transition-all duration-300 ease-in-out"
        >
          {forums.length > 0 ? (
            <Link href={`/forums/${forum.id}`} className="block group">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-primary truncate group-hover:text-primary-hover transition-colors duration-200">
                  {forum.title}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light text-primary shadow-sm transform group-hover:scale-105 transition-transform duration-200">
                    {forum._count.posts} posts
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-secondary">
                    {forum.description || "No description provided"}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-secondary sm:mt-0">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {forum.creator.name || forum.creator.email}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-primary truncate">
                  {forum.title}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light text-primary shadow-sm">
                    {forum._count.posts} posts
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-secondary">
                    {forum.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-secondary sm:mt-0">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {forum.creator.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

async function ForumsContent() {
  // Try to fetch recent forums, use dummy data on error
  let recentForums: Forum[] = [];
  
  try {
    recentForums = await prisma.forum.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching forums:", error);
    // If there's an error with Prisma, we'll use dummy data
    recentForums = [];
  }

  // Use dummy forums if no real forums exist
  const forumsToDisplay = recentForums.length > 0 ? recentForums : dummyForums;

  return <ForumsList forums={forumsToDisplay} />;
}

export default function Home() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <section className="relative text-center py-24 rounded-2xl text-white overflow-hidden">
        {/* Animated background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/90 to-pink-500/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-20 animate-pulse"></div>
        
        {/* Animated shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full translate-x-1/3 translate-y-1/3 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full animate-blob animation-delay-4000"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-20">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 animate-slideDown bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Connect. Discuss. Grow.
            </h1>
            <p className="mt-6 text-2xl max-w-2xl mx-auto font-light leading-relaxed animate-fadeIn">
              Join thousands of users sharing ideas and building communities in our modern forum platform.
            </p>
            
            <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-md mx-auto">
              <Link
                href="/forums"
                className="group relative px-8 py-4 text-base font-medium rounded-lg shadow-lg bg-white text-primary hover:bg-gray-100 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Browse Forums
                </span>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700"></div>
              </Link>
              <Link
                href="/forums/create"
                className="group relative px-8 py-4 text-base font-medium rounded-lg shadow-lg bg-primary-light/90 text-primary hover:bg-primary-light transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create a Forum
                </span>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700"></div>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-red-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-xs font-bold">+</div>
              </div>
              <p className="text-sm font-medium text-white/90">Join 5,000+ community members</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card shadow-xl rounded-xl overflow-hidden border border-border hover:shadow-2xl transition-shadow duration-500">
        <div className="px-6 py-5 border-b border-border bg-muted">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Recent Forums
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Check out the latest discussion topics
          </p>
        </div>
        <div>
          <Suspense fallback={<ForumSkeleton count={3} />}>
            <ForumsContent />
          </Suspense>
          <div className="px-6 py-5 border-t border-border bg-muted flex justify-center sm:justify-start">
            <Link
              href="/forums"
              className="inline-flex items-center text-primary hover:text-primary-hover font-medium group transition-all duration-300"
            >
              See all forums 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card shadow-lg rounded-xl p-8 border border-border hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.01]">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">Join Our Community Today</h2>
          <p className="text-secondary mb-8">
            Create an account to participate in discussions, create your own forums, and connect with other members.
          </p>
          <Link
            href="/signup"
            className="px-8 py-4 text-base font-medium rounded-md shadow-md bg-primary text-white hover:bg-primary-hover transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}

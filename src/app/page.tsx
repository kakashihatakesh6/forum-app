import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

export default async function Home() {
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

  return (
    <div className="space-y-10">
      <section className="text-center py-16 bg-gradient-to-r from-primary via-accent to-pink-500 rounded-2xl text-white">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Welcome to Forum App
        </h1>
        <p className="mt-4 text-xl max-w-2xl mx-auto opacity-90">
          Join discussions, create forums, and connect with other users in this
          community platform.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/forums"
            className="px-6 py-3 text-base font-medium rounded-md shadow-lg bg-white text-primary hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1"
          >
            Browse All Forums
          </Link>
          <Link
            href="/forums/create"
            className="px-6 py-3 text-base font-medium rounded-md shadow-lg bg-primary-light text-primary hover:bg-indigo-200 transition-all duration-200 transform hover:-translate-y-1"
          >
            Create a Forum
          </Link>
        </div>
      </section>

      <section className="bg-card shadow-xl rounded-xl overflow-hidden border border-border">
        <div className="px-6 py-5 border-b border-border bg-muted">
          <h2 className="text-xl font-semibold text-foreground">Recent Forums</h2>
          <p className="mt-1 text-sm text-secondary">
            Check out the latest discussion topics
          </p>
        </div>
        <div>
          <ul className="divide-y divide-border">
            {forumsToDisplay.map((forum) => (
              <li key={forum.id} className="px-6 py-5 hover:bg-muted transition-colors duration-150">
                {recentForums.length > 0 ? (
                  <Link href={`/forums/${forum.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-primary truncate">{forum.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light text-primary">
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
                        <p>
                          Created by {forum.creator.name || forum.creator.email}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-primary truncate">{forum.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light text-primary">
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
                        <p>
                          Created by {forum.creator.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-border bg-muted">
            <Link
              href="/forums"
              className="inline-flex items-center text-primary hover:text-primary-hover font-medium"
            >
              See all forums →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card shadow-lg rounded-xl p-6 border border-border">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Join Our Community Today</h2>
          <p className="text-secondary max-w-2xl mx-auto mb-6">
            Create an account to participate in discussions, create your own forums, and connect with other members.
          </p>
          <Link
            href="/signup"
            className="px-6 py-3 text-base font-medium rounded-md shadow-md bg-primary text-white hover:bg-primary-hover transition-all duration-200"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}

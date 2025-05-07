import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Sample dummy forums for empty state
const dummyForums = [
  {
    id: "dummy1",
    title: "Welcome to the Community",
    description: "Introduce yourself and connect with other members",
    creator: { name: "Admin", email: "admin@example.com" },
    _count: { posts: 12 },
    createdAt: new Date(),
  },
  {
    id: "dummy2",
    title: "Tech Discussion",
    description: "Share thoughts on the latest technology trends",
    creator: { name: "TechGuru", email: "tech@example.com" },
    _count: { posts: 8 },
    createdAt: new Date(),
  },
  {
    id: "dummy3",
    title: "Development Best Practices",
    description: "Discussion on coding standards and practices",
    creator: { name: "DevMaster", email: "dev@example.com" },
    _count: { posts: 15 },
    createdAt: new Date(),
  },
  {
    id: "dummy4",
    title: "Project Showcase",
    description: "Share and discuss your latest projects",
    creator: { name: "ProjectLead", email: "projects@example.com" },
    _count: { posts: 6 },
    createdAt: new Date(),
  },
  {
    id: "dummy5",
    title: "Job Opportunities",
    description: "Post and find job opportunities in tech",
    creator: { name: "Recruiter", email: "jobs@example.com" },
    _count: { posts: 10 },
    createdAt: new Date(),
  },
];

export default async function Forums() {
  // Fetch all forums ordered by most recent
  const forums = await prisma.forum.findMany({
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

  // Use dummy forums if no real forums exist
  const forumsToDisplay = forums.length > 0 ? forums : dummyForums;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forums</h1>
          <p className="text-gray-600 mt-1">Join discussions on various topics</p>
        </div>
        <Link
          href="/forums/create"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
        >
          Create Forum
        </Link>
      </div>

      {forums.length > 0 ? (
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {forumsToDisplay.map((forum) => (
              <li key={forum.id} className="hover:bg-gray-50 transition-colors duration-150">
                <Link href={`/forums/${forum.id}`} className="block px-6 py-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-medium text-indigo-600 truncate">
                      {forum.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {forum._count.posts} posts
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:flex sm:justify-between">
                    <div className="sm:flex max-w-2xl">
                      <p className="text-sm text-gray-600">
                        {forum.description || "No description provided"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span className="mr-2">Created by</span>
                      <span className="font-medium text-gray-900">
                        {forum.creator.name || forum.creator.email}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {forums.length > 0 && forum.createdAt ? (
                      <span>
                        Created on {new Date(forum.createdAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>Recently created</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-100">
            <ul className="divide-y divide-gray-200">
              {dummyForums.map((forum) => (
                <li key={forum.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-medium text-indigo-600 truncate">
                        {forum.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {forum._count.posts} posts
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 sm:flex sm:justify-between">
                      <div className="sm:flex max-w-2xl">
                        <p className="text-sm text-gray-600">
                          {forum.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="mr-2">Created by</span>
                        <span className="font-medium text-gray-900">
                          {forum.creator.name}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <span>Recently created</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100 text-center">
            <h3 className="text-lg font-medium text-indigo-800 mb-2">
              Showing example forums
            </h3>
            <p className="text-indigo-600 mb-4">
              Create your own forum to get started with real discussions!
            </p>
            <Link
              href="/forums/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Your First Forum
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
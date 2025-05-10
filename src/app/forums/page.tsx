import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FiPlus } from "react-icons/fi";
import { Suspense } from "react";
import ForumsList from "@/components/ForumsList";
import PageTransition from "@/components/PageTransition";
import { Prisma } from "@prisma/client";

// Define interfaces
interface Forum {
  id: string;
  title: string;
  description: string | null;
  creator: {
    name: string | null;
    email: string;
    image: string | null;
  };
  _count: {
    posts: number;
  };
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  tags: string[];
  category: string;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

// Categories similar to GitHub Discussions
const categories: Category[] = [
  { name: "All", slug: "all", count: 0 },
  { name: "Q&A", slug: "q-and-a", count: 0 },
  { name: "General", slug: "general", count: 0 },
  { name: "Ideas", slug: "ideas", count: 0 },
  { name: "Announcements", slug: "announcements", count: 0 },
];

// Sorting options
const sortOptions = [
  { name: "Latest", slug: "latest" },
  { name: "Top", slug: "top" },
  { name: "Unanswered", slug: "unanswered" },
];

export default async function Forums({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // In Next.js 15, searchParams is a promise
  const params = await searchParams;
  const categorySlug = (params.category as string) || 'all';
  const sortType = (params.sort as string) || 'latest';
  
  // Base query
  const baseQueryOptions: Prisma.ForumFindManyArgs = {
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      creatorId: true,
      tags: true,
      category: true,
      creator: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
    where: {},
    orderBy: {},
  };
  
  // Apply category filter if not 'all'
  if (categorySlug !== 'all') {
    baseQueryOptions.where = {
      ...baseQueryOptions.where,
      category: categorySlug,
    } as Prisma.ForumWhereInput;
  }
  
  // Apply sorting
  if (sortType === 'latest') {
    baseQueryOptions.orderBy = { createdAt: 'desc' };
  } else if (sortType === 'top') {
    baseQueryOptions.orderBy = {
      posts: {
        _count: 'desc',
      },
    } as Prisma.ForumOrderByWithRelationInput;
  } else if (sortType === 'unanswered') {
    baseQueryOptions.where = {
      ...baseQueryOptions.where,
      posts: {
        none: {}
      }
    } as Prisma.ForumWhereInput;
    baseQueryOptions.orderBy = { createdAt: 'desc' };
  }
  
  // Fetch forums and category counts in parallel
  const [forums, categoryCounts] = await Promise.all([
    prisma.forum.findMany(baseQueryOptions) as Promise<Forum[]>,
    prisma.$transaction([
      prisma.forum.count(),
      prisma.forum.count({ where: { category: 'q-and-a' } }),
      prisma.forum.count({ where: { category: 'general' } }),
      prisma.forum.count({ where: { category: 'ideas' } }),
      prisma.forum.count({ where: { category: 'announcements' } }),
    ]),
  ]);
  
  // Update category counts from DB
  categories[0].count = categoryCounts[0]; // all
  categories[1].count = categoryCounts[1]; // q-and-a
  categories[2].count = categoryCounts[2]; // general
  categories[3].count = categoryCounts[3]; // ideas
  categories[4].count = categoryCounts[4]; // announcements
  
  return (
    <PageTransition>
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - similar to GitHub's category navigation */}
          <Suspense fallback={<CategorySidebarSkeleton />}>
            <CategorySidebar 
              categories={categories} 
              selectedCategory={categorySlug} 
              sortType={sortType} 
            />
          </Suspense>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Discussions</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Community discussions to share ideas and feedback
                </p>
              </div>
              <Link
                href="/forums/create"
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
              >
                <FiPlus className="h-4 w-4" />
                <span>New discussion</span>
              </Link>
            </div>
            
            {/* Sort options */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
              <div className="space-x-2">
                {sortOptions.map((option) => (
                  <Link
                    key={option.slug}
                    href={`/forums?${categorySlug !== 'all' ? `category=${categorySlug}&` : ''}sort=${option.slug}`}
                    className={`inline-flex items-center px-3 py-1.5 text-sm border rounded-full ${
                      sortType === option.slug
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {option.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Forums list */}
            <Suspense fallback={<ForumListSkeleton />}>
              <ForumsList forums={forums} />
            </Suspense>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  sortType: string;
}

function CategorySidebar({ categories, selectedCategory, sortType }: CategorySidebarProps) {
  return (
    <aside className="w-full md:w-64 mb-6">
      <nav className="space-y-1">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Categories
        </p>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/forums?category=${category.slug}${sortType !== 'latest' ? `&sort=${sortType}` : ''}`}
            className={`flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md ${
              selectedCategory === category.slug
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{category.name}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              selectedCategory === category.slug
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}>
              {category.count}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function CategorySidebarSkeleton() {
  return (
    <aside className="w-full md:w-64 mb-6">
      <nav className="space-y-1">
        <div className="px-3 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center px-3 py-2">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function ForumListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white p-4 border border-gray-100 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-2"></div>
            </div>
            <div className="flex space-x-1">
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
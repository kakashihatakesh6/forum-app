import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FiPlus } from "react-icons/fi";
import { Suspense } from "react";
import ForumsList from "@/components/ForumsList";
import PageTransition from "@/components/PageTransition";
import { Prisma, Forum as PrismaForum } from "@prisma/client";

// Define interfaces
interface Forum extends Omit<PrismaForum, 'category'> {
  creator: {
    name: string | null;
    email: string;
    image: string | null;
  };
  _count: {
    posts: number;
  };
  category: string;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface PageProps {
  searchParams: {
    category?: string;
    sort?: string;
  };
}

// Sample dummy forums for empty state
const dummyForums: Forum[] = [
  {
    id: "dummy1",
    title: "Welcome to the Community",
    description: "Introduce yourself and connect with other members",
    creator: { name: "Admin", email: "admin@example.com", image: null },
    _count: { posts: 12 },
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: "dummy-creator-1",
    tags: ["welcome", "community"],
    category: "general",
  },
  {
    id: "dummy2",
    title: "Tech Discussion",
    description: "Share thoughts on the latest technology trends",
    creator: { name: "TechGuru", email: "tech@example.com", image: null },
    _count: { posts: 8 },
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: "dummy-creator-2",
    tags: ["tech", "trends"],
    category: "general",
  },
  {
    id: "dummy3",
    title: "Development Best Practices",
    description: "Discussion on coding standards and practices",
    creator: { name: "DevMaster", email: "dev@example.com", image: null },
    _count: { posts: 15 },
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: "dummy-creator-3",
    tags: ["development", "best-practices"],
    category: "q-and-a",
  },
  {
    id: "dummy4",
    title: "Project Showcase",
    description: "Share and discuss your latest projects",
    creator: { name: "ProjectLead", email: "projects@example.com", image: null },
    _count: { posts: 6 },
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: "dummy-creator-4",
    tags: ["projects", "showcase"],
    category: "ideas",
  },
  {
    id: "dummy5",
    title: "Job Opportunities",
    description: "Post and find job opportunities in tech",
    creator: { name: "Recruiter", email: "jobs@example.com", image: null },
    _count: { posts: 10 },
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: "dummy-creator-5",
    tags: ["jobs", "careers"],
    category: "announcements",
  },
];

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

export default async function Forums({ searchParams }: PageProps) {
  const categorySlug = searchParams?.category || 'all';
  const sortType = searchParams?.sort || 'latest';
  
  // Base query
  const baseQueryOptions: Prisma.ForumFindManyArgs = {
    where: {},
    orderBy: {},
    include: {
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
    baseQueryOptions.orderBy = [
      { posts: { _count: 'desc' } },
      { createdAt: 'desc' } // Secondary sort by creation date
    ] as Prisma.ForumOrderByWithRelationInput[];
  } else if (sortType === 'unanswered') {
    baseQueryOptions.where = {
      ...baseQueryOptions.where,
      posts: {
        none: {}
      }
    } as Prisma.ForumWhereInput;
    baseQueryOptions.orderBy = { createdAt: 'desc' };
  }
  
  // Fetch forums based on filters and sorting
  const forums = await prisma.forum.findMany(baseQueryOptions) as Forum[];

  // Use dummy forums if no real forums exist
  let forumsToDisplay = forums.length > 0 ? forums : dummyForums;
  
  // If using dummy data, apply the same filters we would in the database
  if (forums.length === 0) {
    if (categorySlug !== 'all') {
      forumsToDisplay = dummyForums.filter(forum => forum.category === categorySlug);
    }
    
    if (sortType === 'latest') {
      forumsToDisplay.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortType === 'top') {
      forumsToDisplay.sort((a, b) => b._count.posts - a._count.posts);
    } else if (sortType === 'unanswered') {
      forumsToDisplay = dummyForums.filter(forum => forum._count.posts === 0);
      forumsToDisplay.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }
  
  // Count forums per category for sidebar display
  const categoryCounts: Record<string, number> = {
    all: forumsToDisplay.length,
    'q-and-a': forums.length > 0 
      ? forums.filter(f => f.category === 'q-and-a').length 
      : dummyForums.filter(f => f.category === 'q-and-a').length,
    'general': forums.length > 0 
      ? forums.filter(f => f.category === 'general').length 
      : dummyForums.filter(f => f.category === 'general').length,
    'ideas': forums.length > 0 
      ? forums.filter(f => f.category === 'ideas').length 
      : dummyForums.filter(f => f.category === 'ideas').length,
    'announcements': forums.length > 0 
      ? forums.filter(f => f.category === 'announcements').length 
      : dummyForums.filter(f => f.category === 'announcements').length,
  };
  
  // Update category counts
  categories.forEach(category => {
    category.count = categoryCounts[category.slug] || 0;
  });
  
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
                        ? 'bg-gray-100 border-gray-300 font-medium'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    {option.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Forum list with suspense */}
            <Suspense fallback={<ForumListSkeleton />}>
              <ForumsList forums={forumsToDisplay} />
            </Suspense>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Category sidebar component 
interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  sortType: string;
}

function CategorySidebar({ categories, selectedCategory, sortType }: CategorySidebarProps) {
  return (
    <div className="md:w-1/4 shrink-0">
      <div className="sticky top-8 space-y-6">
        <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-700">Categories</h2>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link 
                    href={`/forums?category=${category.slug}${sortType !== 'latest' ? `&sort=${sortType}` : ''}`} 
                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                      category.slug === selectedCategory ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
          <div className="px-4 py-3">
            <h2 className="text-sm font-medium text-gray-700">Resources</h2>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-blue-600 hover:underline">
                  About this forum
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-blue-600 hover:underline">
                  Community guidelines
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-blue-600 hover:underline">
                  Frequently asked questions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton components for loading state
function CategorySidebarSkeleton() {
  return (
    <div className="md:w-1/4 shrink-0">
      <div className="sticky top-8 space-y-6">
        <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-2">
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForumListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 overflow-hidden shadow-sm">
          <div className="flex items-start">
            <div className="flex-1">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
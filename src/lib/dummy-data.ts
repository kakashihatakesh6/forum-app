export const dummyUser = {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    bio: "Full-stack developer passionate about web technologies and open source.",
  }
  
  export const dummyForums = [
    {
      id: "forum1",
      title: "Next.js 13 App Router Discussion",
      description: "Let's discuss the new App Router in Next.js 13 and share our experiences.",
      excerpt:
        "Next.js 13 introduced the App Router, a new paradigm for building applications with React Server Components. What are your thoughts on this approach compared to the Pages Router?",
      category: "Tech",
      participants: 24,
      commentCount: 18,
      createdAt: "2023-05-15T10:30:00Z",
      author: {
        id: "user2",
        name: "Sarah Miller",
        avatar: "/avtaar.png",
      },
    },
    {
      id: "forum2",
      title: "UI Design Trends for 2023",
      description: "Exploring the latest UI design trends that are shaping the web in 2023.",
      excerpt:
        "From neumorphism to glassmorphism, design trends are constantly evolving. What UI trends do you think will dominate in 2023? Let's share our predictions and examples.",
      category: "Design",
      participants: 18,
      commentCount: 12,
      createdAt: "2023-05-10T14:20:00Z",
      author: {
        id: "user3",
        name: "Michael Chen",
        avatar: "/avtaar.png",
      },
    },
    {
      id: "forum3",
      title: "TypeScript Best Practices",
      description: "Share your TypeScript best practices and tips for large-scale applications.",
      excerpt:
        "TypeScript has become the standard for many JavaScript projects. What are your best practices for maintaining type safety and developer productivity in large codebases?",
      category: "Tech",
      participants: 32,
      commentCount: 27,
      createdAt: "2023-05-08T09:15:00Z",
      author: {
        id: "user4",
        name: "Emily Rodriguez",
        avatar: "/avtaar.png",
      },
    },
    {
      id: "forum4",
      title: "Accessibility in Modern Web Apps",
      description: "Discussing strategies for making web applications more accessible to all users.",
      excerpt:
        "Web accessibility is crucial but often overlooked. How do you ensure your applications are accessible? What tools and techniques do you use for testing?",
      category: "Development",
      participants: 15,
      commentCount: 9,
      createdAt: "2023-05-05T16:45:00Z",
      author: {
        id: "user5",
        name: "David Kim",
        avatar: "/avtaar.png",
      },
    },
    {
      id: "forum5",
      title: "State Management in 2023",
      description: "Comparing different state management solutions for modern web applications.",
      excerpt:
        "From Redux to Zustand, React Query to Jotai - the state management landscape has evolved significantly. What's your preferred approach for different types of applications?",
      category: "Tech",
      participants: 29,
      commentCount: 23,
      createdAt: "2023-05-03T11:30:00Z",
      author: {
        id: "user6",
        name: "Olivia Taylor",
        avatar: "/avtaar.png",
      },
    },
    {
      id: "forum6",
      title: "Serverless vs. Traditional Backend",
      description: "Debating the pros and cons of serverless architecture compared to traditional backends.",
      excerpt:
        "Serverless architecture promises reduced operational costs and automatic scaling, but comes with its own challenges. When do you choose serverless over traditional backends?",
      category: "Development",
      participants: 21,
      commentCount: 16,
      createdAt: "2023-05-01T13:20:00Z",
      author: {
        id: "user7",
        name: "James Wilson",
        avatar: "/avtaar.png",
      },
    },
  ]
  
  export const dummyComments = [
    {
      id: "comment1",
      forumId: "forum1",
      content:
        "I've been using the App Router for a few months now and I'm really impressed with the Server Components approach. It's a game-changer for performance.",
      createdAt: "2023-05-15T11:30:00Z",
      author: {
        id: "user3",
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      likes: 7,
    },
    {
      id: "comment2",
      forumId: "forum1",
      content:
        "I'm still struggling with the mental model. The mixing of server and client components feels confusing at first. Any resources that helped you understand it better?",
      createdAt: "2023-05-15T12:15:00Z",
      author: {
        id: "user4",
        name: "Emily Rodriguez",
        avatar: "/avtaar.png",
      },
      likes: 3,
    },
    {
      id: "comment3",
      forumId: "forum1",
      content:
        "The official Next.js documentation is quite good, but I also found Josh Comeau's blog posts very helpful for understanding the new paradigm.",
      createdAt: "2023-05-15T12:45:00Z",
      author: {
        id: "user2",
        name: "Sarah Miller",
        avatar: "/avtaar.png",
      },
      likes: 5,
      parentId: "comment2",
    },
    {
      id: "comment4",
      forumId: "forum1",
      content:
        "One thing I'm not clear about is how to handle global state with Server Components. Has anyone figured out a clean pattern for this?",
      createdAt: "2023-05-15T13:30:00Z",
      author: {
        id: "user5",
        name: "David Kim",
        avatar: "/avtaar.png",
      },
      likes: 2,
    },
    {
      id: "comment5",
      forumId: "forum1",
      content:
        "For global state, I've been using a combination of React Context for client components and database/cache for server components. It's working well so far.",
      createdAt: "2023-05-15T14:00:00Z",
      author: {
        id: "user6",
        name: "Olivia Taylor",
        avatar: "/avtaar.png",
      },
      likes: 8,
      parentId: "comment4",
    },
  ]
  
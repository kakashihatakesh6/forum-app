import Link from "next/link"
import { ForumList } from "@/components/forum-list"
// import { UserNav } from "@/components/user-nav"
import { PlusIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">ForumHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </header> */}
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Forums</h1>
              <p className="text-gray-500">Browse and join discussions on various topics</p>
            </div>
            <Link href="/create-forum">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Forum
              </button>
            </Link>
          </div>
          <ForumList />
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ForumHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

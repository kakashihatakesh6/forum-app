import React from "react";

interface ForumSkeletonProps {
  count?: number;
}

export default function ForumSkeleton({ count = 3 }: ForumSkeletonProps) {
  return (
    <div className="animate-pulse">
      <ul className="divide-y divide-border">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="ml-2 flex-shrink-0">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
            <div className="mt-4 sm:flex sm:justify-between">
              <div className="sm:flex">
                <div className="h-4 bg-gray-200 rounded w-full sm:w-96 max-w-full"></div>
              </div>
              <div className="mt-3 sm:mt-0">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 
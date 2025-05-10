/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt: Date;
  postsCount?: number;
  commentsCount?: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    
    if (status === "authenticated" && session?.user) {
      // Simulating profile data fetch
      // In a real app, you'd fetch from an API
      setProfile({
        id: session.user.id || "user-id",
        name: session.user.name || "User",
        email: session.user.email || "user@example.com",
        image: session.user.image || "/default-avatar.png",
        bio: "I love discussing interesting topics and connecting with people!",
        createdAt: new Date(),
        postsCount: 12,
        commentsCount: 48,
      });
      
      setName(session.user.name || "");
      setBio("I love discussing interesting topics and connecting with people!");
      setIsLoading(false);
    }
  }, [status, session, router]);
  
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Simulate API call to update profile
      // In a real app, you'd make a fetch request to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (profile) {
        setProfile({
          ...profile,
          name,
          bio,
        });
      }
      
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile not found</h1>
          <p className="mt-2 text-gray-600">Unable to load your profile information.</p>
          <Link href="/" className="mt-6 inline-block px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-blue-500">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                {profile.image ? (
                  <Image 
                    src={profile.image} 
                    alt={profile.name} 
                    width={128} 
                    height={128}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            {success && (
              <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-lg text-center font-medium border border-green-100 animate-pulse">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-center font-medium border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            
            {!isEditing ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm text-indigo-600 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                  >
                    Edit Profile
                  </button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{profile.bio || "No bio available."}</p>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-xl">
                    <div className="text-indigo-600 text-3xl font-bold">{profile.postsCount}</div>
                    <div className="text-gray-600 mt-1">Posts</div>
                  </div>
                  
                  <div className="bg-indigo-50 p-6 rounded-xl">
                    <div className="text-indigo-600 text-3xl font-bold">{profile.commentsCount}</div>
                    <div className="text-gray-600 mt-1">Comments</div>
                  </div>
                  
                  <div className="bg-indigo-50 p-6 rounded-xl">
                    <div className="text-indigo-600 text-3xl font-bold">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</div>
                    <div className="text-gray-600 mt-1">Joined</div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleEditProfile} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.div 
          className="absolute top-0 left-0 right-0 bottom-0 border-4 border-t-indigo-600 border-r-indigo-300 border-b-indigo-100 border-l-indigo-400 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5
          }}
        />
      </motion.div>
      <motion.p 
        className="text-gray-500 mt-8 text-lg font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Loading...
      </motion.p>
    </div>
  );
} 
"use client";

import { motion, Variants } from "framer-motion";

const shimmer: Variants = {
  hidden: { backgroundPosition: "200% 0" },
  visible: { 
    backgroundPosition: "-200% 0",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "mirror" as const
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar skeleton */}
        <div className="md:w-1/4 shrink-0">
          <div className="sticky top-8 space-y-6">
            <motion.div 
              className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <motion.div 
                  className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                ></motion.div>
              </div>
              <motion.div 
                className="p-2 space-y-1"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center justify-between px-3 py-2"
                    variants={fadeInUp}
                  >
                    <motion.div 
                      className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                      variants={shimmer}
                      style={{ backgroundSize: "200% 100%" }}
                    ></motion.div>
                    <motion.div 
                      className="h-4 w-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"
                      variants={shimmer}
                      style={{ backgroundSize: "200% 100%" }}
                    ></motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="px-4 py-3">
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 w-28 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="flex-1">
          <motion.div 
            className="mb-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center">
              <div>
                <motion.div 
                  className="h-8 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mb-2"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                ></motion.div>
                <motion.div 
                  className="h-4 w-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                ></motion.div>
              </div>
              <motion.div 
                className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                variants={shimmer}
                initial="hidden"
                animate="visible"
                style={{ backgroundSize: "200% 100%" }}
              ></motion.div>
            </div>
          </motion.div>
          
          <motion.div
            className="flex items-center mb-4 border-b border-gray-200 pb-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="inline-block h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                ></motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Forum items */}
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className="bg-white border border-gray-100 rounded-lg p-4 overflow-hidden shadow-sm"
                variants={fadeInUp}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <motion.div 
                      className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mb-2"
                      variants={shimmer}
                      style={{ backgroundSize: "200% 100%" }}
                    ></motion.div>
                    <motion.div 
                      className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mb-3"
                      variants={shimmer}
                      style={{ backgroundSize: "200% 100%" }}
                    ></motion.div>
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"
                        variants={shimmer}
                        style={{ backgroundSize: "200% 100%" }}
                      ></motion.div>
                      <motion.div 
                        className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                        variants={shimmer}
                        style={{ backgroundSize: "200% 100%" }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                </div>
                <div className="mt-3 flex space-x-2">
                  {[...Array(2)].map((_, j) => (
                    <motion.div 
                      key={j} 
                      className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"
                      variants={shimmer}
                      style={{ backgroundSize: "200% 100%" }}
                    ></motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
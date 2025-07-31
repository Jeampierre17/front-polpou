import React from "react";
import { motion } from "framer-motion";

const SkeletonCard: React.FC = () => (
  <motion.div
    className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 min-h-[420px] flex flex-col gap-4 animate-pulse border border-gray-100 dark:border-gray-800"
    initial={{ opacity: 0.7 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0.7 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex-[0_0_50%] min-h-[120px] bg-gray-200 dark:bg-gray-800 rounded-xl w-full" />
    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
    <div className="flex gap-2 mt-2">
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
    </div>
  </motion.div>
);

export default SkeletonCard;

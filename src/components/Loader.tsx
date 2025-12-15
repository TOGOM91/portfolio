import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-24 h-24">
          <motion.div
            className="absolute inset-0 border-4 border-t-purple-600 border-r-blue-500 border-b-teal-400 border-l-pink-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-t-blue-500 border-r-teal-400 border-b-pink-500 border-l-purple-600 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.p
          className="mt-6 text-xl font-medium text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            That coming...
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loader;
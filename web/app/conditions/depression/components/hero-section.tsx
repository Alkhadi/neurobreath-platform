'use client';

import { motion } from 'framer-motion';
import { Heart, Brain, Sun } from 'lucide-react';

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6 py-12"
    >
      <div className="flex justify-center space-x-4 mb-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Brain className="w-12 h-12 text-primary" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <Heart className="w-12 h-12 text-secondary" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <Sun className="w-12 h-12 text-yellow-500" />
        </motion.div>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
        Understanding <span className="text-primary">Depression</span>
      </h1>
      
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        A comprehensive, evidence-based resource for patients, caregivers, and healthcare professionals
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-gray-700">Treatable Condition</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium text-gray-700">Multiple Treatment Options</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-sm font-medium text-gray-700">Support Available 24/7</span>
        </div>
      </div>
    </motion.section>
  );
}

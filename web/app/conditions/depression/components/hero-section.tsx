'use client';

import { motion } from 'framer-motion';
import { Heart, Brain, Sun } from 'lucide-react';

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6 py-14 sm:py-16 lg:py-20"
    >
      <div className="flex justify-center space-x-4 mb-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Brain className="w-12 h-12 text-blue-300" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <Heart className="w-12 h-12 text-pink-300" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <Sun className="w-12 h-12 text-yellow-300" />
        </motion.div>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
        Understanding <span className="text-blue-300">Depression</span>
      </h1>

      <p className="text-xl text-white/85 max-w-3xl mx-auto leading-relaxed">
        A comprehensive, evidence-based resource for patients, caregivers, and healthcare professionals
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <div className="bg-white/90 rounded-lg shadow-md p-4 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-gray-700">Treatable Condition</span>
        </div>
        <div className="bg-white/90 rounded-lg shadow-md p-4 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium text-gray-700">Multiple Treatment Options</span>
        </div>
        <div className="bg-white/90 rounded-lg shadow-md p-4 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-sm font-medium text-gray-700">Support Available 24/7</span>
        </div>
      </div>
    </motion.section>
  );
}

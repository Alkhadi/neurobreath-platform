'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle } from 'lucide-react';

export function DownloadPDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      // Trigger browser print dialog
      if (typeof window !== 'undefined') {
        window?.print?.();
      }
      setIsGenerating(false);
      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 3000);
    }, 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6 no-print"
    >
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 rounded-xl shadow-lg p-8">
        <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Download This Guide</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Save this comprehensive depression resource as a PDF for offline reference. Perfect for sharing with healthcare providers, family members, or keeping for personal use.
        </p>
        
        {!isComplete ? (
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`inline-flex items-center space-x-3 px-8 py-4 rounded-lg shadow-lg transition-all duration-300 ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 hover:shadow-xl hover:scale-105'
            } text-white font-bold text-lg`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Preparing PDF...</span>
              </>
            ) : (
              <>
                <Download size={24} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center space-x-3 px-8 py-4 rounded-lg bg-green-500 text-white font-bold text-lg"
          >
            <CheckCircle size={24} />
            <span>Print Dialog Opened!</span>
          </motion.div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          Tip: Use your browser's print function to save as PDF or print directly
        </p>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 py-8 border-t border-gray-200">
        <p className="mb-2">
          <span className="font-semibold">Understanding Depression</span> - A Comprehensive Evidence-Based Resource
        </p>
        <p>Last Updated: January 2026 | For educational purposes only | Not medical advice</p>
        <p className="mt-2">If you are in crisis, please contact emergency services or crisis support immediately.</p>
      </div>
    </motion.section>
  );
}

"use client";

import { gradientOptions } from "@/lib/utils";

interface GradientSelectorProps {
  selectedGradient: string;
  onSelect: (gradient: string) => void;
}

export function GradientSelector({ selectedGradient, onSelect }: GradientSelectorProps) {
  const gradientClassMap: Record<string, string> = {
    'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)': 'bg-gradient-to-br from-purple-600 to-blue-500',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)': 'bg-gradient-to-br from-indigo-500 to-purple-600',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)': 'bg-gradient-to-br from-fuchsia-400 to-rose-500',
    'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)': 'bg-gradient-to-br from-emerald-500 to-green-400',
    'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)': 'bg-gradient-to-br from-violet-400 to-fuchsia-500',
    'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)': 'bg-gradient-to-br from-orange-400 to-rose-400',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)': 'bg-gradient-to-br from-sky-400 to-cyan-400',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)': 'bg-gradient-to-br from-pink-400 to-yellow-300',
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">Background Style</label>
      <div className="grid grid-cols-4 gap-3">
        {gradientOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.gradient)}
            className={`h-12 rounded-lg transition-all hover:scale-105 ${
              selectedGradient === option.gradient ? "ring-4 ring-purple-500 ring-offset-2" : "ring-1 ring-gray-200"
            } ${gradientClassMap[option.gradient] ?? ''}`}
            title={option.name}
            aria-label={`Select ${option.name} gradient`}
          />
        ))}
      </div>
    </div>
  );
}


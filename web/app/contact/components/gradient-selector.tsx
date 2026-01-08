"use client";

import { gradientOptions } from "@/lib/utils";

interface GradientSelectorProps {
  selectedGradient: string;
  onSelect: (gradient: string) => void;
}

export function GradientSelector({ selectedGradient, onSelect }: GradientSelectorProps) {
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
            }`}
            style={{ background: option.gradient }}
            title={option.name}
            aria-label={`Select ${option.name} gradient`}
          />
        ))}
      </div>
    </div>
  );
}


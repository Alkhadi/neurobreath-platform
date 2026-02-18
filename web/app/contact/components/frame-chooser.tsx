"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { getBuiltinFrames, type NbCardFrame } from "@/lib/nbcard-frames";

type FrameCategory = "ADDRESS" | "BANK" | "BUSINESS" | "FLYER" | "WEDDING";

interface FrameChooserProps {
  category: FrameCategory;
  onSelect: (frameUrl: string) => void;
  onSelectTemplate?: (template: { id: string }) => void;
  onClose: () => void;
}

const CACHE_KEY = "nbcard-frames-cache-v2";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

function getCachedFrames(cacheKey: string): { frames: NbCardFrame[]; timestamp: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

function setCachedFrames(cacheKey: string, frames: NbCardFrame[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ frames, timestamp: Date.now() })
    );
  } catch {
    // Silently ignore cache failures
  }
}

export function FrameChooser({ category, onSelect, onClose }: FrameChooserProps) {
  const [frames, setFrames] = useState<NbCardFrame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFrames() {
      setLoading(true);

      const categoryParam = category.trim().toLowerCase();
      const categoryCacheKey = `${CACHE_KEY}:${categoryParam || "all"}`;

      const builtinFallback = getBuiltinFrames();

      // Try cache first
      const cached = getCachedFrames(categoryCacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL && Array.isArray(cached.frames)) {
        setFrames(cached.frames);
        setLoading(false);
        return;
      }

      // Fetch from API (should always return 200 + valid JSON shape)
      try {
        const res = await fetch(`/api/nb-card/frames?category=${encodeURIComponent(categoryParam)}`);
        const data = res.ok ? await res.json() : null;
        const apiFrames: NbCardFrame[] = Array.isArray(data?.frames) ? data.frames : [];

        const usable = apiFrames.filter((f) => typeof f?.src === "string" && f.src.startsWith("/"));
        const nextFrames = usable.length > 0 ? usable : builtinFallback;
        setFrames(nextFrames);
        setCachedFrames(categoryCacheKey, nextFrames);
      } catch {
        // Never throw/log: silently fall back to built-in frames.
        setFrames(builtinFallback);
      } finally {
        setLoading(false);
      }
    }

    loadFrames();
  }, [category]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Professional Frames</h2>
            <p className="text-sm opacity-90">
              {category === "ADDRESS"
                ? "Address Details Frames"
                : category === "BANK"
                ? "Bank Details Frames"
                : category === "BUSINESS"
                ? "Business Profile Frames"
                : category === "FLYER"
                ? "Flyer Templates"
                : "Wedding Flyer Templates"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8 text-gray-600">
              Loading frames...
            </div>
          )}

          {!loading && frames.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {frames.map((frame) => (
                <button
                  type="button"
                  key={frame.id}
                  onClick={() => {
                    // Frames are always selected by src. (No overlay labels/text in thumbnails.)
                    onSelect(frame.src);
                    toast.success("Frame applied");
                    onClose();
                  }}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-lg"
                >
                  <Image
                    src={frame.src}
                    alt={frame.name || "Frame"}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {!loading && frames.length === 0 && (
            <div className="text-center py-8 text-gray-600">No frames available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

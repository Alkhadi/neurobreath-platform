"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";

type FrameCategory = "ADDRESS" | "BANK" | "BUSINESS";

interface Frame {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

interface FrameChooserProps {
  category: FrameCategory;
  onSelect: (frameUrl: string) => void;
  onClose: () => void;
}

const CACHE_KEY = "nbcard-frames-cache";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

function getCachedFrames(): { frames: Frame[]; timestamp: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

function setCachedFrames(frames: Frame[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ frames, timestamp: Date.now() })
    );
  } catch (err) {
    console.error("Failed to cache frames:", err);
  }
}

export function FrameChooser({ category, onSelect, onClose }: FrameChooserProps) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFrames() {
      setLoading(true);
      setError(null);

      // Try cache first
      const cached = getCachedFrames();
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        const categoryFrames = cached.frames.filter((f) => f.category === category);
        setFrames(categoryFrames);
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const res = await fetch(`/api/nb-card/frames?category=${category}`);
        if (!res.ok) throw new Error("Failed to fetch frames");
        const data = await res.json();
        setFrames(data.frames || []);
        setCachedFrames(data.frames || []);
      } catch (err) {
        console.error("Failed to fetch frames:", err);
        setError("Server unavailable. Using cached frames if available.");
        // Fallback to any cached frames
        if (cached) {
          const categoryFrames = cached.frames.filter((f) => f.category === category);
          setFrames(categoryFrames);
        }
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
                : "Business Profile Frames"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8 text-gray-600">
              Loading frames...
            </div>
          )}

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm text-yellow-800">
              {error}
            </div>
          )}

          {!loading && frames.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No frames available for this category yet.
            </div>
          )}

          {!loading && frames.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {frames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => {
                    onSelect(frame.imageUrl);
                    toast.success("Frame applied");
                    onClose();
                  }}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-lg"
                >
                  <Image
                    src={frame.imageUrl}
                    alt={frame.name}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-semibold">{frame.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

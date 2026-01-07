import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// NBCard Contact Page Types and Utilities
export const gradientOptions = [
  { name: "Purple Dream", gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)" },
  { name: "Ocean Blue", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Sunset", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Forest", gradient: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  { name: "Lavender", gradient: "linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)" },
  { name: "Fire", gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" },
  { name: "Deep Ocean", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Royal", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
];

export interface Profile {
  id: string;
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  profileDescription: string;
  businessDescription: string;
  photoUrl?: string;
  gradient: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  company: string;
  category: "Business" | "Personal";
  notes: string;
  createdAt: string;
}

export const defaultProfile: Profile = {
  id: "default",
  fullName: "Alkhadi Koroma",
  jobTitle: "Flutter Developer",
  phone: "+44-77-1315-0495",
  email: "koromadjmoe@gmail.com",
  profileDescription: "",
  businessDescription: "",
  gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
  socialMedia: {},
};
import { breathTechnique478Metadata } from '@/lib/seo/page-metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = breathTechnique478Metadata

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

import { generatePageMetadata } from '@/lib/seo/metadata'
import { InstallPageClient } from '@/app/install/ui'

export const metadata: Metadata = generatePageMetadata({
  title: 'Install NeuroBreath',
  description:
    'Install NeuroBreath as an app on iPhone, Android, and desktop. Includes step-by-step instructions, a share link, and a QR code.',
  path: '/install',
})

export default function InstallPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <InstallPageClient />
    </div>
  )
}

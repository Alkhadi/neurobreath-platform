'use client'

import { toast } from 'sonner'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) {
    toast.message('Section not found', { description: `Missing #${id} on this page.` })
    return
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function NBCardJumpLinks() {
  return (
    <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={() => {
          scrollToId('nbcard-install')
          window.dispatchEvent(new Event('nbcard:install-request'))
        }}
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all"
      >
        Download / Install
      </button>
      <button
        type="button"
        onClick={() => scrollToId('nbcard-app')}
        className="inline-flex items-center justify-center rounded-xl border border-purple-200 bg-white text-gray-800 px-6 py-3 font-semibold hover:bg-purple-50 transition-all"
      >
        Open App
      </button>
    </div>
  )
}

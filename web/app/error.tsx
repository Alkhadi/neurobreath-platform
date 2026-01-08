'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Something went wrong</h2>
      <pre className="whitespace-pre-wrap my-4 text-sm text-slate-700 bg-slate-50 p-4 rounded border border-slate-200 overflow-auto">{error.message}</pre>
      <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">Try again</button>
    </div>
  )
}


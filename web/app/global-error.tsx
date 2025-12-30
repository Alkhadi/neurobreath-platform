'use client'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <html lang="en-GB">
      <body className="p-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Application error</h2>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-white p-4 rounded border border-slate-200 overflow-auto">{error.message}</pre>
        </div>
      </body>
    </html>
  )
}


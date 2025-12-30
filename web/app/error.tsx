'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16, marginBottom: 16 }}>{error.message}</pre>
      <button onClick={reset} style={{ padding: '8px 16px', cursor: 'pointer' }}>Try again</button>
    </div>
  )
}


'use client'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <html>
      <body style={{ padding: 24 }}>
        <h2>Application error</h2>
        <pre>{error.message}</pre>
      </body>
    </html>
  )
}


interface CoachNoteProps {
  icon?: string
  title?: string
  message: string
  variant?: 'default' | 'success' | 'warning' | 'info'
}

const variantStyles = {
  default: 'from-yellow-50 to-orange-50 border-yellow-200',
  success: 'from-green-50 to-emerald-50 border-green-200',
  warning: 'from-orange-50 to-red-50 border-orange-200',
  info: 'from-blue-50 to-indigo-50 border-blue-200'
}

export default function CoachNote({
  icon = '💡',
  title = 'Coach note:',
  message,
  variant = 'default'
}: CoachNoteProps) {
  return (
    <div
      className={`bg-gradient-to-br ${variantStyles[variant]} rounded-lg p-4 border`}
      role="note"
      aria-label="Coaching tip"
    >
      <p className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">
          {icon} {title}
        </span>{' '}
        {message}
      </p>
    </div>
  )
}

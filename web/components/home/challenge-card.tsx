import { Button } from '@/components/ui/button'

interface ChallengeCardProps {
  challenge: {
    challengeKey: string
    challengeName: string
    currentSessions: number
    targetSessions: number
    isCompleted: boolean
  }
  definition?: {
    minutes: number
    category: string
    why: string
  }
  onStart: () => void
  onMarkComplete: () => void
}

export default function ChallengeCard({
  challenge,
  definition,
  onStart,
  onMarkComplete
}: ChallengeCardProps) {
  const progress = ((challenge.currentSessions ?? 0) / (challenge.targetSessions ?? 1)) * 100
  const totalMinutesLogged = (challenge.currentSessions ?? 0) * (definition?.minutes ?? 3)

  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all"
      role="article"
      aria-label={`${challenge.challengeName} challenge`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {challenge.challengeName}
          </h3>
          <p className="text-xs text-gray-600">
            Goal: {definition?.minutes}min · {challenge.targetSessions} days · {definition?.category}
          </p>
        </div>
        {challenge.isCompleted && (
          <span
            className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full"
            aria-label="Challenge completed"
          >
            ✓
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4">{definition?.why}</p>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={onStart}
            aria-label={`Start ${challenge.challengeName} challenge`}
          >
            Start
          </Button>
          <Button
            onClick={onMarkComplete}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={challenge.isCompleted}
            aria-label={`Mark ${challenge.challengeName} as complete`}
          >
            Mark complete
          </Button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Day {challenge.currentSessions} of {challenge.targetSessions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={Math.min(progress, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Challenge progress: ${Math.round(progress)}%`}
          >
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {totalMinutesLogged} min logged
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ${
                progress <= 0 ? 'w-0' :
                progress <= 5 ? 'w-[5%]' :
                progress <= 10 ? 'w-[10%]' :
                progress <= 15 ? 'w-[15%]' :
                progress <= 20 ? 'w-[20%]' :
                progress <= 25 ? 'w-1/4' :
                progress <= 30 ? 'w-[30%]' :
                progress <= 35 ? 'w-[35%]' :
                progress <= 40 ? 'w-[40%]' :
                progress <= 45 ? 'w-[45%]' :
                progress <= 50 ? 'w-1/2' :
                progress <= 55 ? 'w-[55%]' :
                progress <= 60 ? 'w-[60%]' :
                progress <= 65 ? 'w-[65%]' :
                progress <= 70 ? 'w-[70%]' :
                progress <= 75 ? 'w-3/4' :
                progress <= 80 ? 'w-[80%]' :
                progress <= 85 ? 'w-[85%]' :
                progress <= 90 ? 'w-[90%]' :
                progress <= 95 ? 'w-[95%]' :
                'w-full'
              }`}
              aria-hidden="true"
            />
          </div>
          <span className="sr-only">Challenge progress: {Math.round(progress)}%</span>
          <div className="text-xs text-gray-500 mt-1">
            {totalMinutesLogged} min logged
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

interface ActivityDay {
  date: string
  count: number
  minutesBreathing?: number
}

type CalendarViewMode = 'minutes' | 'events'

interface ProgressCalendarProps {
  dailySeries: ActivityDay[]
  range: '7d' | '30d' | '90d'
  onDateClick?: (date: string) => void
  streakThresholdMinutes?: number
}

export function ProgressCalendar({
  dailySeries,
  onDateClick,
  streakThresholdMinutes = 1,
}: ProgressCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => new Date())
  const [viewMode, setViewMode] = React.useState<CalendarViewMode>('minutes')

  const hasMinutesData = React.useMemo(
    () => dailySeries.some((d) => (d.minutesBreathing ?? 0) > 0),
    [dailySeries],
  )

  const effectiveViewMode = hasMinutesData ? viewMode : 'events'

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true })
    }

    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
      }
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  const activityMap = React.useMemo(() => {
    const map = new Map<string, ActivityDay>()
    for (const day of dailySeries) {
      map.set(day.date, day)
    }
    return map
  }, [dailySeries])

  const getIntensityByMinutes = (minutes: number): string => {
    if (minutes === 0) return 'bg-gray-100'
    if (minutes < 5) return 'bg-green-200'
    if (minutes < 10) return 'bg-green-400'
    if (minutes < 20) return 'bg-green-600'
    return 'bg-green-800'
  }

  const getIntensityByEvents = (count: number): string => {
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-green-200'
    if (count <= 5) return 'bg-green-400'
    if (count <= 10) return 'bg-green-600'
    return 'bg-green-800'
  }

  const getActivityLevel = (activity: ActivityDay | undefined): string => {
    if (!activity) return 'bg-gray-100'
    return effectiveViewMode === 'minutes'
      ? getIntensityByMinutes(activity.minutesBreathing ?? 0)
      : getIntensityByEvents(activity.count)
  }

  const formatDateKey = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Activity Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            &#8592;
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
            {monthName}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            &#8594;
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const dateStr = formatDateKey(day.date)
          const activity = activityMap.get(dateStr)
          const count = activity?.count ?? 0
          const minutes = activity?.minutesBreathing ?? 0
          const qualified = minutes >= streakThresholdMinutes
          const level = getActivityLevel(activity)
          const isDark = level === 'bg-green-600' || level === 'bg-green-800'

          return (
            <button
              type="button"
              key={idx}
              onClick={() => day.isCurrentMonth && onDateClick?.(dateStr)}
              className={`
                aspect-square rounded-lg transition-all
                ${day.isCurrentMonth ? level : 'bg-gray-50 opacity-40'}
                ${day.isCurrentMonth && count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-green-500' : ''}
                ${!day.isCurrentMonth || count === 0 ? 'cursor-default' : ''}
                relative group
              `}
              title={
                day.isCurrentMonth
                  ? count > 0
                    ? `${day.date.getDate()} ${day.date.toLocaleDateString('en-GB', { month: 'short' })}: ${Math.round(minutes)} min, ${count} events${qualified ? ' (streak qualified)' : ''}`
                    : `${day.date.getDate()} ${day.date.toLocaleDateString('en-GB', { month: 'short' })}: No activity`
                  : ''
              }
              disabled={!day.isCurrentMonth || count === 0}
            >
              <span
                className={`text-xs font-medium ${
                  day.isCurrentMonth ? (isDark ? 'text-white' : 'text-gray-700') : 'text-gray-400'
                }`}
              >
                {day.date.getDate()}
              </span>

              {/* Enhanced tooltip */}
              {day.isCurrentMonth && count > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                    <div className="font-medium mb-1">
                      {day.date.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div>{Math.round(minutes)} min breathing</div>
                    <div>{count} total events</div>
                    <div
                      className={`mt-1 text-[10px] font-medium ${
                        qualified ? 'text-green-300' : 'text-yellow-300'
                      }`}
                    >
                      {qualified ? 'Streak qualified' : 'Not streak qualified'}
                    </div>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend + view toggle */}
      <div className="flex items-center justify-between mt-6">
        {hasMinutesData ? (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-500 mr-1">View:</span>
            <button
              type="button"
              onClick={() => setViewMode('minutes')}
              className={`px-2 py-0.5 rounded transition-colors ${
                effectiveViewMode === 'minutes'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Minutes
            </button>
            <button
              type="button"
              onClick={() => setViewMode('events')}
              className={`px-2 py-0.5 rounded transition-colors ${
                effectiveViewMode === 'events'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Events
            </button>
          </div>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {(effectiveViewMode === 'minutes'
              ? [0, 2, 7, 15, 25]
              : [0, 1, 3, 7, 12]
            ).map((val) => (
              <div
                key={val}
                className={`w-4 h-4 rounded ${
                  effectiveViewMode === 'minutes'
                    ? getIntensityByMinutes(val)
                    : getIntensityByEvents(val)
                }`}
                title={
                  effectiveViewMode === 'minutes'
                    ? val === 0
                      ? 'No activity'
                      : `${val}+ min`
                    : val === 0
                      ? 'No activity'
                      : `${val}+ events`
                }
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

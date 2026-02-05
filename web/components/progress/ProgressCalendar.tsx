import React from 'react'

interface ActivityDay {
  date: string // YYYY-MM-DD
  count: number
  minutes?: number
}

interface ProgressCalendarProps {
  dailySeries: ActivityDay[]
  range: '7d' | '30d' | '90d' // Unused currently but kept for future filtering
  onDateClick?: (date: string) => void
}

export function ProgressCalendar({ dailySeries, onDateClick }: ProgressCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => new Date())

  // Generate calendar grid for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []
    
    // Add previous month padding
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // Add current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true })
    }
    
    // Add next month padding
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
      }
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  
  // Create a map of date -> activity for quick lookup
  const activityMap = React.useMemo(() => {
    const map = new Map<string, ActivityDay>()
    dailySeries.forEach(day => map.set(day.date, day))
    return map
  }, [dailySeries])

  const getActivityLevel = (count: number): string => {
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-green-200'
    if (count <= 5) return 'bg-green-400'
    if (count <= 10) return 'bg-green-600'
    return 'bg-green-800'
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Activity Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const dateStr = formatDate(day.date)
          const activity = activityMap.get(dateStr)
          const count = activity?.count || 0
          const minutes = activity?.minutes || 0
          
          return (
            <button
              key={idx}
              onClick={() => day.isCurrentMonth && onDateClick?.(dateStr)}
              className={`
                aspect-square rounded-lg transition-all
                ${day.isCurrentMonth ? getActivityLevel(count) : 'bg-gray-50 opacity-40'}
                ${day.isCurrentMonth && count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-green-500' : ''}
                ${!day.isCurrentMonth || count === 0 ? 'cursor-default' : ''}
                relative group
              `}
              title={
                day.isCurrentMonth && count > 0
                  ? `${day.date.getDate()} ${day.date.toLocaleDateString('en-GB', { month: 'short' })}: ${count} activities, ${minutes}min`
                  : day.isCurrentMonth
                  ? `${day.date.getDate()} ${day.date.toLocaleDateString('en-GB', { month: 'short' })}: No activity`
                  : ''
              }
              disabled={!day.isCurrentMonth || count === 0}
            >
              <span
                className={`
                  text-xs font-medium
                  ${day.isCurrentMonth ? (count > 5 ? 'text-white' : 'text-gray-700') : 'text-gray-400'}
                `}
              >
                {day.date.getDate()}
              </span>
              
              {/* Tooltip on hover */}
              {day.isCurrentMonth && count > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1">
                    {count} activities • {minutes}min
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 2, 5, 10, 15].map(count => (
            <div
              key={count}
              className={`w-4 h-4 rounded ${getActivityLevel(count)}`}
              title={count === 0 ? 'No activity' : `${count}+ activities`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

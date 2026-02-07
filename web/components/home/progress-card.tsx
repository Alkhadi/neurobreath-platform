import { LucideIcon } from 'lucide-react'

interface StatItemProps {
  icon: LucideIcon
  value: number
  label: string
  bgColor: string
  iconColor: string
}

function StatItem({ icon: Icon, value, label, bgColor, iconColor }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-2`}>
        <Icon className={`w-6 h-6 ${iconColor}`} aria-hidden="true" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  )
}

interface ProgressCardProps {
  statItems: StatItemProps[]
}

export default function ProgressCard({ statItems }: ProgressCardProps) {
  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
      role="region"
      aria-label="Your breathing practice progress"
    >
      <h3 className="font-semibold text-gray-900 mb-6 text-center">Your Progress</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <StatItem
            key={index}
            icon={item.icon}
            value={item.value}
            label={item.label}
            bgColor={item.bgColor}
            iconColor={item.iconColor}
          />
        ))}
      </div>
    </div>
  )
}

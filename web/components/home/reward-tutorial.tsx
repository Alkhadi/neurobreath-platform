
'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function RewardTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [badgeGameStep, setBadgeGameStep] = useState(0)
  const [badgeUnlocked, setBadgeUnlocked] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    toggleButtonRef.current?.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
  }, [isOpen])

  const handleBadgePractice = () => {
    setBadgeGameStep(1)
    setTimeout(() => {
      setBadgeGameStep(2)
    }, 1000)
  }

  const handleBadgeLog = () => {
    setBadgeGameStep(3)
    setTimeout(() => {
      setBadgeUnlocked(true)
      setBadgeGameStep(4)
    }, 1000)
  }

  const handleBadgeReset = () => {
    setBadgeGameStep(0)
    setBadgeUnlocked(false)
  }

  return (
    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        aria-expanded="false"
        aria-controls="reward-tutorial-panel"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎖️</span>
          <span className="text-lg font-semibold text-gray-900">How badges work</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div id="reward-tutorial-panel" className="p-6 pt-0 space-y-8">
          {/* Step 1: What are badges */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">What are badges?</h3>
            </div>
            <div className="pl-11">
              <div className="grid grid-cols-2 gap-6 mb-4 max-w-md mx-auto">
                <div className="bg-gray-100 rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-2 opacity-40">🌱</div>
                  <div className="font-semibold text-gray-500 mb-1">First calm minute</div>
                  <div className="text-sm text-gray-500">Locked</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center border-2 border-green-400 animate-[pulse_2s_ease-in-out_infinite]">
                  <div className="text-4xl mb-2">🌱</div>
                  <div className="font-semibold text-green-900 mb-1">First calm minute</div>
                  <div className="text-sm text-green-700 font-semibold">Unlocked ✨</div>
                </div>
              </div>
              <p className="text-gray-700">
                Badges are gentle milestones that celebrate your breathing practice. They unlock automatically
                when you meet the requirements—no competition, just personal progress!
              </p>
            </div>
          </div>

          {/* Step 2: How badges unlock */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">How badges unlock</h3>
            </div>
            <div className="pl-11">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center flex-1 max-w-xs">
                  <div className="text-3xl mb-2">🫁</div>
                  <div className="font-semibold text-gray-900 mb-1">1. Practice breathing</div>
                  <div className="text-sm text-gray-600">Complete a breathing session</div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="bg-green-50 rounded-lg p-4 text-center flex-1 max-w-xs">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-semibold text-gray-900 mb-1">2. Log your session</div>
                  <div className="text-sm text-gray-600">Click "Log" or "Mark complete"</div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="bg-purple-50 rounded-lg p-4 text-center flex-1 max-w-xs">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="font-semibold text-gray-900 mb-1">3. Badge unlocks!</div>
                  <div className="text-sm text-gray-600">Automatic celebration</div>
                </div>
              </div>
              <p className="text-gray-700">
                Badges unlock automatically when you log sessions. The system tracks your progress in the
                background—you just focus on breathing!
              </p>
            </div>
          </div>

          {/* Step 3: Badge types */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Types of badges</h3>
            </div>
            <div className="pl-11 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '⏱️', title: 'Time-based', desc: 'Total minutes practiced (e.g., 10-minute marker)' },
                { icon: '🔥', title: 'Streak badges', desc: 'Consecutive days of practice (3-day, 7-day streak)' },
                { icon: '🎯', title: 'Category badges', desc: 'Specific types of sessions (Focus, Sleep, etc.)' }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                  <div className="text-sm text-gray-700">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Interactive Game */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Try unlocking a badge! 🎮</h3>
            </div>
            <div className="pl-11">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg p-6">
                <p className="text-center font-semibold text-gray-900 mb-6">
                  <strong>Practice and log a session to unlock your first badge!</strong>
                </p>
                <div
                  className={`max-w-sm mx-auto rounded-lg p-8 text-center transition-all duration-500 mb-6 ${
                    badgeUnlocked
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 scale-105'
                      : 'bg-gray-100 border-2 border-dashed border-gray-300'
                  }`}
                >
                  <div className={`text-6xl mb-3 transition-all duration-500 ${
                    badgeUnlocked ? 'animate-bounce' : 'opacity-40'
                  }`}>
                    🌱
                  </div>
                  <div className={`font-bold text-lg mb-2 ${
                    badgeUnlocked ? 'text-green-900' : 'text-gray-500'
                  }`}>
                    First calm minute
                  </div>
                  <div className="text-sm text-gray-600 mb-3">Log any 1-minute practice</div>
                  <div className={`font-semibold ${
                    badgeUnlocked ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {badgeUnlocked ? 'Unlocked ✨' : 'Locked'}
                  </div>
                </div>
                <div className="flex gap-3 justify-center mb-4">
                  <Button
                    variant="default"
                    onClick={handleBadgePractice}
                    disabled={badgeGameStep > 0 || badgeUnlocked}
                  >
                    <span className="mr-2">🫁</span>
                    Practice (1 min)
                    {badgeGameStep >= 1 && !badgeUnlocked && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBadgeLog}
                    disabled={badgeGameStep < 2 || badgeUnlocked}
                  >
                    <span className="mr-2">✅</span>
                    Log session
                    {badgeGameStep >= 3 && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </Button>
                </div>
                {badgeGameStep === 1 && (
                  <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg text-center animate-[fadeIn_0.3s_ease-in]">
                    <p className="text-blue-900 font-semibold">✨ Nice! Now log your session to unlock the badge...</p>
                  </div>
                )}
                {badgeUnlocked && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-center animate-[fadeIn_0.3s_ease-in]">
                      <p className="text-green-900 font-bold text-lg">🎉 Congratulations! Badge unlocked!</p>
                      <p className="text-green-800 text-sm mt-1">Your first milestone celebrated!</p>
                    </div>
                    <div className="text-center">
                      <Button onClick={handleBadgeReset} variant="outline" size="sm">
                        🔄 Try again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 5: Badge Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Badge features 💡</h3>
            </div>
            <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '🔓', title: 'Auto-unlock', desc: 'Badges unlock automatically when you meet requirements—no manual claiming needed.' },
                { icon: '💾', title: 'Stay unlocked', desc: 'Once unlocked, badges stay visible even if you take a break. They celebrate your achievement permanently.' },
                { icon: '🔄', title: 'Reset anytime', desc: 'You can reset badges in the progress section if you want to start fresh. No pressure!' },
                { icon: '🎯', title: 'Personal progress', desc: 'Badges are about your journey, not competition. Celebrate every small win!' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-700">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <Button onClick={() => setIsOpen(false)} size="lg">
              Got it! Start earning badges
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

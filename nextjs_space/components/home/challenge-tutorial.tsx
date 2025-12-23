'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function ChallengeTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [gameStep, setGameStep] = useState(0)
  const [gameProgress, setGameProgress] = useState(0)

  const handleGameStart = () => {
    setGameStep(1)
    setTimeout(() => {
      setGameStep(2)
    }, 1000)
  }

  const handleGameLog = () => {
    setGameProgress(33)
    setGameStep(3)
    setTimeout(() => {
      setGameStep(4)
    }, 1500)
  }

  const handleGameReset = () => {
    setGameStep(0)
    setGameProgress(0)
  }

  return (
    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎮</span>
          <span className="text-lg font-semibold text-gray-900">How to use challenges & quests</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-6 pt-0 space-y-8">
          {/* Step 1: Understanding Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Understanding your stats</h3>
            </div>
            <div className="pl-11">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 animate-pulse">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-sm text-gray-600">Total minutes</div>
                  <div className="text-2xl font-bold text-gray-900">6 min</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 animate-pulse" style={{animationDelay: '0.1s'}}>
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                  <div className="text-2xl font-bold text-gray-900">4</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 animate-pulse" style={{animationDelay: '0.2s'}}>
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-sm text-gray-600">Streak</div>
                  <div className="text-2xl font-bold text-gray-900">1 day</div>
                </div>
              </div>
              <p className="text-gray-700">
                Your stats sidebar tracks your progress automatically. Every time you log a breathing session,
                these numbers update. The <strong>streak</strong> shows consecutive days you've practiced—even 1
                minute counts!
              </p>
            </div>
          </div>

          {/* Step 2: How Cards Work */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">How challenge cards work</h3>
            </div>
            <div className="pl-11">
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-4">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Daily Calm</h4>
                  <p className="text-sm text-gray-600">Goal: 3 minutes · 5 days</p>
                </div>
                <div className="flex gap-3 mb-4">
                  <Button variant="default" className="animate-pulse">
                    Start in daily player
                  </Button>
                  <Button variant="outline" className="animate-pulse" style={{animationDelay: '0.2s'}}>
                    Mark today complete
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full w-2/5 animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                  <span className="text-sm text-gray-600">Day 2 of 5</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">Each card has <strong>two buttons</strong>:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Start/Open buttons</strong> — Launch the breathing tool or guide</li>
                <li><strong>Log/Mark buttons</strong> — Record your session after you finish</li>
              </ul>
              <p className="text-gray-700 mt-3">
                The progress bar at the bottom shows how close you are to completing the challenge goal.
              </p>
            </div>
          </div>

          {/* Step 3: Interactive Game */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Try it yourself! 🎮</h3>
            </div>
            <div className="pl-11">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6">
                <p className="text-center font-semibold text-gray-900 mb-6">
                  <strong>Click the buttons in order:</strong> First start the breathing tool, then log your session!
                </p>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Practice Challenge</h4>
                    <p className="text-sm text-gray-600">Goal: 2 minutes · 3 days</p>
                  </div>
                  <div className="flex gap-3 mb-4">
                    <Button
                      variant="default"
                      onClick={handleGameStart}
                      disabled={gameStep > 0}
                      className="flex-1 relative"
                    >
                      <span className="mr-2">🎧</span>
                      Start breathing
                      {gameStep >= 1 && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600">✓</span>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGameLog}
                      disabled={gameStep < 2 || gameStep > 2}
                      className="flex-1 relative"
                    >
                      <span className="mr-2">✅</span>
                      Log session
                      {gameStep >= 3 && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600">✓</span>
                      )}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-500"
                        style={{ width: `${gameProgress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      Day {Math.floor(gameProgress / 33)} of 3
                    </span>
                  </div>
                </div>
                {gameStep === 1 && (
                  <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center animate-[fadeIn_0.3s_ease-in]">
                    <p className="text-blue-900 font-semibold">✨ Great! Now log your session...</p>
                  </div>
                )}
                {gameStep >= 3 && (
                  <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-center animate-[fadeIn_0.3s_ease-in]">
                    <p className="text-green-900 font-semibold">🎉 Perfect! Your stats are updating...</p>
                  </div>
                )}
                {gameStep >= 4 && (
                  <div className="mt-4 text-center">
                    <Button onClick={handleGameReset} variant="outline" size="sm">
                      🔄 Try again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Quick Visual Guide */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Quick visual guide</h3>
            </div>
            <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '🫁', title: '1. Choose your challenge', desc: 'Pick a card that matches your need: calm, focus, sleep, or reset.' },
                { icon: '👆', title: '2. Start breathing', desc: 'Click the primary button to open the breathing tool or guide.' },
                { icon: '⏱️', title: '3. Complete your session', desc: 'Follow the breathing cues. Even 1 minute counts toward your goal!' },
                { icon: '✅', title: '4. Log your progress', desc: 'Click the log button to record your session. Watch your stats update!' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-700">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 5: Pro Tips */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Pro tips 💡</h3>
            </div>
            <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '🎯', title: 'Micro wins matter', desc: 'Log even 30 seconds. Small sessions keep your streak alive and build the habit.' },
                { icon: '📱', title: 'Data stays private', desc: 'All progress is saved only on your device. No accounts, no tracking, no pressure.' },
                { icon: '🔄', title: 'Mix and match', desc: 'You can work on multiple challenges at once. Each tracks independently.' },
                { icon: '📊', title: 'Show your progress', desc: 'Your stats can be shared with teachers, clinicians, or family to show your effort.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
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
              Got it! Start using challenges
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

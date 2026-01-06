'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gamepad2, Star, Trophy, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400']

export function RelaxationGame() {
  const [gameMode, setGameMode] = useState<'menu' | 'bubble' | 'pattern' | 'breathing'>('menu')
  const [score, setScore] = useState(0)
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  const [pattern, setPattern] = useState<number[]>([])
  const [userPattern, setUserPattern] = useState<number[]>([])
  const [showPattern, setShowPattern] = useState(false)
  const [patternLevel, setPatternLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)

  // Bubble Pop Game
  useEffect(() => {
    if (gameMode !== 'bubble') return
    const interval = setInterval(() => {
      setBubbles((prev) => [
        ...prev.slice(-15),
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 10,
          color: colors[Math.floor(Math.random() * colors.length)] ?? colors[0],
        },
      ])
    }, 800)
    return () => clearInterval(interval)
  }, [gameMode])

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id))
    setScore((s) => s + 10)
  }

  // Pattern Memory Game
  const generatePattern = useCallback(() => {
    const newPattern: number[] = []
    for (let i = 0; i < patternLevel + 2; i++) {
      newPattern.push(Math.floor(Math.random() * 4))
    }
    setPattern(newPattern)
    setUserPattern([])
    setShowPattern(true)
    setTimeout(() => setShowPattern(false), (patternLevel + 2) * 600 + 500)
  }, [patternLevel])

  useEffect(() => {
    if (gameMode === 'pattern' && !gameOver) {
      generatePattern()
    }
  }, [gameMode, patternLevel, gameOver, generatePattern])

  const handlePatternClick = (index: number) => {
    if (showPattern || gameOver) return
    const newUserPattern = [...userPattern, index]
    setUserPattern(newUserPattern)

    if (pattern[newUserPattern.length - 1] !== index) {
      setGameOver(true)
      return
    }

    if (newUserPattern.length === pattern.length) {
      setScore((s) => s + patternLevel * 50)
      setPatternLevel((l) => l + 1)
    }
  }

  const resetGame = () => {
    setScore(0)
    setBubbles([])
    setPattern([])
    setUserPattern([])
    setPatternLevel(1)
    setGameOver(false)
    setGameMode('menu')
  }

  if (gameMode === 'menu') {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Gamepad2 className="h-6 w-6 text-teal-600" />
          <h3 className="text-xl font-semibold">Mindfulness Games</h3>
        </div>

        <p className="text-muted-foreground mb-6">
          Interactive games designed to shift focus, reduce rumination, and promote relaxation.
        </p>

        <div className="grid gap-4">
          <button
            onClick={() => setGameMode('bubble')}
            className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg text-left hover:shadow-md transition-shadow"
          >
            <div className="font-semibold mb-1">🫧 Bubble Pop</div>
            <div className="text-sm text-muted-foreground">
              Pop calming bubbles as they appear. Focus on the present moment.
            </div>
          </button>

          <button
            onClick={() => setGameMode('pattern')}
            className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg text-left hover:shadow-md transition-shadow"
          >
            <div className="font-semibold mb-1">🧩 Pattern Memory</div>
            <div className="text-sm text-muted-foreground">
              Remember and repeat patterns. Trains focus and working memory.
            </div>
          </button>
        </div>
      </Card>
    )
  }

  if (gameMode === 'bubble') {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">🫧 Bubble Pop</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
            <Button size="sm" variant="outline" onClick={resetGame}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative h-[300px] bg-gradient-to-b from-sky-100 to-sky-200 rounded-lg overflow-hidden">
          <AnimatePresence>
            {bubbles.map((bubble) => (
              <motion.button
                key={bubble.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                exit={{ scale: 1.5, opacity: 0 }}
                onClick={() => popBubble(bubble.id)}
                className={`absolute w-12 h-12 rounded-full ${bubble.color} cursor-pointer hover:scale-110 transition-transform shadow-lg`}
                style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
              />
            ))}
          </AnimatePresence>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-4">
          Pop the bubbles to relax. Focus on each one as it appears.
        </p>
      </Card>
    )
  }

  if (gameMode === 'pattern') {
    const patternColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">🧩 Pattern Memory</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold">Level {patternLevel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
            <Button size="sm" variant="outline" onClick={resetGame}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {gameOver ? (
          <div className="text-center py-8">
            <h4 className="text-2xl font-bold mb-2">Game Over!</h4>
            <p className="text-muted-foreground mb-4">Final Score: {score}</p>
            <Button onClick={resetGame}>Play Again</Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              {showPattern ? (
                <span className="text-lg font-medium text-teal-600">Watch the pattern...</span>
              ) : (
                <span className="text-lg font-medium">Your turn! Repeat the pattern</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-[250px] mx-auto">
              {patternColors.map((color, idx) => {
                const isActive = showPattern && pattern[Math.floor((Date.now() / 600) % pattern.length)] === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handlePatternClick(idx)}
                    disabled={showPattern}
                    className={`h-24 rounded-lg transition-all ${color} ${
                      isActive ? 'opacity-100 scale-105 shadow-lg' : 'opacity-60 hover:opacity-80'
                    } ${!showPattern && 'cursor-pointer'}`}
                  />
                )
              })}
            </div>

            <div className="flex justify-center gap-1 mt-4">
              {pattern.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx < userPattern.length ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </Card>
    )
  }

  return null
}

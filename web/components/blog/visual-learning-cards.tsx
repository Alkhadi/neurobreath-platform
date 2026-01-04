'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Printer } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { VisualLearningCard } from '@/types/ai-coach'

interface VisualLearningCardsProps {
  cards: VisualLearningCard[]
  title: string
}

export default function VisualLearningCards({ cards, title }: VisualLearningCardsProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [isExporting, setIsExporting] = useState(false)
  
  const toggleCard = (cardId: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }
  
  const handleDownload = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/ai-coach/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, cards })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `neurobreath-learning-cards-${Date.now()}.svg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }
  
  const handlePrint = () => {
    window.print()
  }
  
  return (
    <Card id="visual-cards" className="scroll-mt-20">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Visual Learning Cards</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Teaching-grade cards you can save, print, or share. Click to flip.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-1" />
              {isExporting ? 'Exporting...' : 'Download SVG'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-1" />
              Print / PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2">
          {cards.map(card => {
            const isFlipped = flippedCards.has(card.id)
            const hasBack = !!card.back
            
            return (
              <LearningCard
                key={card.id}
                card={card}
                isFlipped={isFlipped}
                onFlip={() => hasBack && toggleCard(card.id)}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface LearningCardProps {
  card: VisualLearningCard
  isFlipped: boolean
  onFlip: () => void
}

function LearningCard({ card, isFlipped, onFlip }: LearningCardProps) {
  const hasBack = !!card.back
  const Icon = getIcon(card.iconKey)
  
  return (
    <div
      className={`relative h-48 cursor-pointer perspective-1000 ${hasBack ? '' : 'cursor-default'}`}
      onClick={onFlip}
      role={hasBack ? 'button' : 'article'}
      tabIndex={hasBack ? 0 : undefined}
      onKeyDown={(e) => {
        if (hasBack && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onFlip()
        }
      }}
      aria-label={hasBack ? `Flip card: ${card.title}` : card.title}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <Card className="absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-2">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                {Icon && <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              </div>
              {card.emoji && <span className="text-2xl">{card.emoji}</span>}
            </div>
            <h3 className="font-semibold text-base mb-2">{card.title}</h3>
            <div className="flex-1 space-y-1">
              {card.lines.map((line, idx) => (
                <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            {card.audienceTag && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {card.audienceTag}
              </Badge>
            )}
            {hasBack && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Click to flip →
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Back */}
        {hasBack && (
          <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 border-2">
            <CardContent className="p-4 h-full flex flex-col">
              {card.back?.title && (
                <h3 className="font-semibold text-base mb-2">{card.back.title}</h3>
              )}
              <div className="flex-1 space-y-1">
                {card.back?.lines.map((line, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                    • {line}
                  </p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                ← Click to flip back
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function getIcon(iconKey: string): React.ComponentType<{ className?: string }> | null {
  const iconMap: Record<string, keyof typeof LucideIcons> = {
    brain: 'Brain',
    heart: 'Heart',
    users: 'Users',
    home: 'Home',
    school: 'GraduationCap',
    briefcase: 'Briefcase',
    clipboard: 'ClipboardCheck',
    stethoscope: 'Stethoscope',
    lightbulb: 'Lightbulb',
    target: 'Target',
    calendar: 'Calendar',
    checkCircle: 'CheckCircle',
    alertCircle: 'AlertCircle',
    wind: 'Wind',
    moon: 'Moon',
    sun: 'Sun',
    book: 'BookOpen',
    shield: 'Shield'
  }
  
  const iconName = iconMap[iconKey] || 'BookOpen'
  return (LucideIcons as any)[iconName] || null
}






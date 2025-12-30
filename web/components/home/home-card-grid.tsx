'use client'

import { ReactNode, Children, cloneElement, isValidElement } from 'react'

interface HomeCardGridProps {
  children: ReactNode
  className?: string
}

/**
 * HomeCardGrid - A smart grid wrapper for homepage cards
 * 
 * Automatically detects when a 3-column grid would leave a single orphan card
 * in the last row and spans that card across all columns for a cleaner look.
 * 
 * Grid structure: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
 * 
 * Orphan detection: When childrenCount % 3 === 1 (and childrenCount > 1),
 * the last card spans all columns (md:col-span-2 lg:col-span-3)
 */
export default function HomeCardGrid({ children, className = '' }: HomeCardGridProps) {
  const childrenArray = Children.toArray(children)
  const childrenCount = childrenArray.length
  
  // Detect orphan: single card in last row (totalCards % 3 === 1)
  const hasOrphan = childrenCount > 1 && childrenCount % 3 === 1
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}>
      {childrenArray.map((child, index) => {
        const isLastItem = index === childrenCount - 1
        const shouldSpanFull = hasOrphan && isLastItem
        
        if (shouldSpanFull) {
          // Wrap last orphan card in a full-width span
          return (
            <div key={index} className="md:col-span-2 lg:col-span-3">
              {child}
            </div>
          )
        }
        
        return <div key={index}>{child}</div>
      })}
    </div>
  )
}


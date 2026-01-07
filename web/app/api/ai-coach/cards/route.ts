import { NextRequest, NextResponse } from 'next/server'
import type { CardExportRequest } from '@/types/ai-coach'

export async function POST(request: NextRequest) {
  try {
    const body: CardExportRequest = await request.json()
    const { title, cards } = body
    
    if (!cards || cards.length === 0) {
      return NextResponse.json(
        { error: 'No cards provided' },
        { status: 400 }
      )
    }
    
    // Generate SVG for all cards
    const cardsSVG = generateCardsSVG(title, cards)
    
    // For now, return the SVG directly
    // In production, you would use Satori + Resvg to convert to PNG
    // or a headless browser screenshot service
    
    return new NextResponse(cardsSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="neurobreath-learning-cards-${Date.now()}.svg"`
      }
    })
  } catch (error) {
    console.error('Cards export error:', error)
    return NextResponse.json(
      { error: 'Failed to export cards' },
      { status: 500 }
    )
  }
}

function generateCardsSVG(title: string, cards: any[]): string {
  const cardWidth = 300
  const cardHeight = 200
  const padding = 20
  const cols = 3
  const rows = Math.ceil(cards.length / cols)
  
  const totalWidth = cols * cardWidth + (cols + 1) * padding
  const totalHeight = rows * cardHeight + (rows + 1) * padding + 80 // Extra for title
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      .card { fill: white; stroke: #e2e8f0; stroke-width: 2; rx: 12; }
      .card-title { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; fill: #1e293b; }
      .card-text { font-family: 'Inter', sans-serif; font-size: 14px; fill: #475569; line-height: 1.5; }
      .main-title { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 600; fill: #0f172a; }
      .emoji { font-size: 32px; }
    </style>
  </defs>
  
  <rect width="${totalWidth}" height="${totalHeight}" fill="#f8fafc"/>
  
  <text x="${totalWidth / 2}" y="50" text-anchor="middle" class="main-title">${escapeXML(title)}</text>
  
`
  
  cards.forEach((card, idx) => {
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const x = col * cardWidth + (col + 1) * padding
    const y = row * cardHeight + (row + 1) * padding + 80
    
    svg += generateCardSVG(card, x, y, cardWidth, cardHeight)
  })
  
  svg += '</svg>'
  return svg
}

function generateCardSVG(card: any, x: number, y: number, width: number, height: number): string {
  const emoji = card.emoji || '📚'
  const title = card.title || 'Untitled'
  const lines = card.lines || []
  
  let svg = `
  <g>
    <rect class="card" x="${x}" y="${y}" width="${width}" height="${height}"/>
    <text x="${x + 20}" y="${y + 40}" class="emoji">${emoji}</text>
    <text x="${x + 70}" y="${y + 45}" class="card-title">${escapeXML(title)}</text>
`
  
  lines.forEach((line: string, idx: number) => {
    const words = line.split(' ')
    let currentLine = ''
    let lineY = y + 80 + idx * 25
    
    // Simple word wrapping
    const maxChars = 35
    words.forEach((word: string) => {
      if ((currentLine + word).length > maxChars) {
        svg += `    <text x="${x + 20}" y="${lineY}" class="card-text">${escapeXML(currentLine)}</text>\n`
        currentLine = word + ' '
        lineY += 20
      } else {
        currentLine += word + ' '
      }
    })
    
    if (currentLine.trim()) {
      svg += `    <text x="${x + 20}" y="${lineY}" class="card-text">${escapeXML(currentLine.trim())}</text>\n`
    }
  })
  
  svg += '  </g>\n'
  return svg
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}








/**
 * Seed script for LessonCatalog
 * 
 * Populates the database with lessons from the in-memory LESSON_CATALOG.
 * 
 * Run with: npx tsx scripts/seed-lessons.ts
 */

import { PrismaClient } from '@prisma/client'
import { LESSON_CATALOG } from '../lib/placement-plan'
import { NB_LEVEL_ORDER, NBLevel, LEARNER_GROUP_ORDER } from '../lib/placement-levels'

const prisma = new PrismaClient()

async function seedLessons() {
  console.log('🌱 Seeding lesson catalog...\n')
  
  let totalCreated = 0
  let totalUpdated = 0
  
  for (const level of NB_LEVEL_ORDER) {
    const lessons = LESSON_CATALOG[level]
    console.log(`Level ${level}: ${lessons.length} lessons`)
    
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i]
      
      const data = {
        slug: lesson.slug,
        title: lesson.title,
        description: `${lesson.title} - ${lesson.lessonType} for ${level}`,
        nbLevel: level,
        learnerGroups: [...LEARNER_GROUP_ORDER], // Available for all groups
        skillFocus: lesson.skillFocus,
        subSkills: [], // Can be populated later
        lessonType: lesson.lessonType,
        durationMinutes: lesson.durationMinutes,
        difficulty: getDifficulty(level),
        prerequisites: [], // Can be populated later
        suggestedNext: [], // Can be populated later
        orderInLevel: i + 1,
        contentPath: `/lessons/${lesson.slug}`,
        thumbnailUrl: null,
        tags: [...lesson.skillFocus, lesson.lessonType],
        isActive: true,
        isFreeContent: true,
      }
      
      try {
        const existing = await prisma.lessonCatalog.findUnique({
          where: { slug: lesson.slug },
        })
        
        if (existing) {
          await prisma.lessonCatalog.update({
            where: { slug: lesson.slug },
            data,
          })
          totalUpdated++
        } else {
          await prisma.lessonCatalog.create({ data })
          totalCreated++
        }
      } catch (error) {
        console.error(`  Error with ${lesson.slug}:`, error)
      }
    }
  }
  
  console.log(`\n✅ Done! Created: ${totalCreated}, Updated: ${totalUpdated}`)
  console.log(`   Total lessons in database: ${totalCreated + totalUpdated}`)
}

function getDifficulty(level: NBLevel): string {
  const numericLevel = parseInt(level.replace('NB-L', ''))
  if (numericLevel <= 2) return 'easy'
  if (numericLevel <= 5) return 'medium'
  return 'hard'
}

async function main() {
  try {
    await seedLessons()
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

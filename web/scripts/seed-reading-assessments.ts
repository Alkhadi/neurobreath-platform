/**
 * Seed script for reading assessment data
 * 
 * Run with: npx prisma generate && npx tsx scripts/seed-reading-assessments.ts
 * Or: yarn prisma generate && yarn tsx scripts/seed-reading-assessments.ts
 */

import { PrismaClient } from '@prisma/client'
import {
  SAMPLE_PASSAGES,
  SAMPLE_WORD_LISTS,
  COMPREHENSION_QUESTIONS,
} from '../lib/reading-assessment-seed'

const prisma = new PrismaClient()

async function seedReadingAssessments() {
  console.log('🌱 Seeding reading assessment data...')

  try {
    // Seed passages
    console.log('📖 Creating reading passages...')
    for (const passage of SAMPLE_PASSAGES) {
      await prisma.readingPassage.upsert({
        where: { id: passage.id },
        update: {
          title: passage.title,
          text: passage.text,
          wordCount: passage.wordCount,
          levelBand: passage.levelBand,
          license: passage.license,
          sourceAttribution: passage.sourceAttribution,
        },
        create: {
          id: passage.id,
          title: passage.title,
          text: passage.text,
          wordCount: passage.wordCount,
          levelBand: passage.levelBand,
          license: passage.license,
          sourceAttribution: passage.sourceAttribution,
        },
      })
    }
    console.log(`✓ Created ${SAMPLE_PASSAGES.length} reading passages`)

    // Seed word lists
    console.log('📝 Creating word lists...')
    for (const list of SAMPLE_WORD_LISTS) {
      await prisma.wordList.upsert({
        where: { id: list.id },
        update: {
          title: list.title,
          levelBand: list.levelBand,
          words: list.words,
          wordCount: list.words.length,
          license: list.license,
        },
        create: {
          id: list.id,
          title: list.title,
          levelBand: list.levelBand,
          words: list.words,
          wordCount: list.words.length,
          license: list.license,
        },
      })
    }
    console.log(`✓ Created ${SAMPLE_WORD_LISTS.length} word lists`)

    // Seed comprehension questions
    console.log('❓ Creating comprehension questions...')
    for (const question of COMPREHENSION_QUESTIONS) {
      const passageExists = await prisma.readingPassage.findUnique({
        where: { id: question.passageId },
      })

      if (passageExists) {
        // Convert choices array to JSON format expected by Prisma
        const choicesJson = question.choices.map((text, index) => ({
          index,
          text,
        }))

        await prisma.comprehensionQuestion.upsert({
          where: { id: question.id },
          update: {
            passageId: question.passageId,
            prompt: question.prompt,
            choices: choicesJson,
            correctChoiceIndex: question.correctChoiceIndex,
            difficulty: question.difficulty,
            explanation: question.explanation,
          },
          create: {
            id: question.id,
            passageId: question.passageId,
            prompt: question.prompt,
            choices: choicesJson,
            correctChoiceIndex: question.correctChoiceIndex,
            difficulty: question.difficulty,
            explanation: question.explanation,
          },
        })
      } else {
        console.warn(`⚠ Passage ${question.passageId} not found, skipping question ${question.id}`)
      }
    }
    console.log(
      `✓ Created ${COMPREHENSION_QUESTIONS.length} comprehension questions`
    )

    console.log('✅ Reading assessment data seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding reading assessment data:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    await seedReadingAssessments()
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

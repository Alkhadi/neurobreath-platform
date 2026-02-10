import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const daysRaw = process.argv[2]
  const days = daysRaw ? Number(daysRaw) : 180

  if (!Number.isFinite(days) || days <= 0) {
    throw new Error('Usage: tsx scripts/purge-guest-universal-progress.ts [days]')
  }

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const result = await prisma.universalProgressEvent.deleteMany({
    where: {
      userId: null,
      deviceId: { not: null },
      createdAt: { lt: cutoff },
    },
  })

  console.log(
    JSON.stringify(
      {
        ok: true,
        deleted: result.count,
        cutoff: cutoff.toISOString(),
      },
      null,
      2
    )
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

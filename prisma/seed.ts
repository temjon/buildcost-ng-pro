import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with 2025 Nigerian construction data...')

  // Construction rates per m² (2025 data)
  await prisma.constructionRate.createMany({
    data: [
      { finish: 'BASIC', rateNGN: 161460 },
      { finish: 'MEDIUM', rateNGN: 242190 },
      { finish: 'LUXURY', rateNGN: 322920 },
    ],
    skipDuplicates: true,
  })

  // Location multipliers (Q1-2025)
  await prisma.locationMultiplier.createMany({
    data: [
      { location: 'LAGOS', multiplier: 1.25 },
      { location: 'ABUJA', multiplier: 1.20 },
      { location: 'PORT_HARCOURT', multiplier: 1.15 },
      { location: 'ENUGU', multiplier: 1.10 },
      { location: 'RURAL', multiplier: 1.00 },
    ],
    skipDuplicates: true,
  })

  // Material prices (Feb 2025) - with inflation factor 34.8%
  await prisma.materialPrice.createMany({
    data: [
      { item: 'CEMENT', unit: '50kg bag', priceNGN: 8500, location: 'NATIONAL' },
      { item: 'BLOCKS_9INCH', unit: 'piece', priceNGN: 320, location: 'NATIONAL' },
      { item: 'SAND', unit: '20 tonnes', priceNGN: 45000, location: 'NATIONAL' },
      { item: 'GRANITE', unit: '30 tonnes', priceNGN: 95000, location: 'NATIONAL' },
      { item: 'REBAR', unit: 'tonne', priceNGN: 690000, location: 'NATIONAL' },
      { item: 'ROOFING_SHEETS', unit: 'bundle', priceNGN: 85000, location: 'NATIONAL' },
      { item: 'TILES_CERAMIC', unit: 'm²', priceNGN: 4500, location: 'NATIONAL' },
      { item: 'PAINT_EMULSION', unit: '20L bucket', priceNGN: 28000, location: 'NATIONAL' },
      { item: 'DOORS_FLUSH', unit: 'piece', priceNGN: 45000, location: 'NATIONAL' },
      { item: 'WINDOWS_ALUMINUM', unit: 'm²', priceNGN: 25000, location: 'NATIONAL' },
      { item: 'ELECTRICAL_CABLES', unit: '100m roll', priceNGN: 35000, location: 'NATIONAL' },
      { item: 'PLUMBING_PIPES', unit: '6m length', priceNGN: 8500, location: 'NATIONAL' },
    ],
    skipDuplicates: true,
  })

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@buildcost.ng' },
    update: {},
    create: {
      email: 'admin@buildcost.ng',
      name: 'BuildCost Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created:')
  console.log('  - 3 construction rates (Basic, Medium, Luxury)')
  console.log('  - 5 location multipliers')
  console.log('  - 12 material prices with 2025 market data')
  console.log('  - 1 admin user')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
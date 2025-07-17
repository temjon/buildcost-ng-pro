import { prisma } from './prisma'

export interface CostEstimate {
  total: number
  low: number
  high: number
  items: CostBreakdown[]
  materials: MaterialBreakdown[]
  confidence: number
}

export interface CostBreakdown {
  category: string
  item: string
  unitCost: number
  quantity: number
  total: number
}

export interface MaterialBreakdown {
  item: string
  unit: string
  quantity: number
  unitPrice: number
  total: number
}

export interface EstimateInput {
  area: number
  location: string
  finish: string
}

export class CostCalculator {
  private static readonly INFLATION_FACTOR = 1.348 // 34.8% CBN Dec 2024
  private static readonly MONTE_CARLO_ITERATIONS = 1000

  static async calculateEstimate(input: EstimateInput): Promise<CostEstimate> {
    // Get base construction rate
    const constructionRate = await prisma.constructionRate.findUnique({
      where: { finish: input.finish }
    })
    
    if (!constructionRate) {
      throw new Error(`Construction rate not found for finish: ${input.finish}`)
    }

    // Get location multiplier
    const locationMultiplier = await prisma.locationMultiplier.findUnique({
      where: { location: input.location }
    })
    
    if (!locationMultiplier) {
      throw new Error(`Location multiplier not found for: ${input.location}`)
    }

    // Calculate base cost
    const baseCostPerSqm = constructionRate.rateNGN * locationMultiplier.multiplier
    const baseTotalCost = baseCostPerSqm * input.area

    // Get material prices for detailed breakdown
    const materials = await prisma.materialPrice.findMany()
    
    // Calculate detailed cost breakdown
    const costBreakdown = this.calculateDetailedBreakdown(input, baseCostPerSqm, materials)
    
    // Run Monte Carlo simulation for uncertainty analysis
    const monteCarloResults = this.runMonteCarloSimulation(baseTotalCost, this.MONTE_CARLO_ITERATIONS)
    
    return {
      total: Math.round(baseTotalCost),
      low: Math.round(monteCarloResults.percentile5),
      high: Math.round(monteCarloResults.percentile95),
      items: costBreakdown.items,
      materials: costBreakdown.materials,
      confidence: 0.9 // 90% confidence interval
    }
  }

  private static calculateDetailedBreakdown(
    input: EstimateInput, 
    baseCostPerSqm: number, 
    materials: any[]
  ) {
    const items: CostBreakdown[] = []
    const materialBreakdown: MaterialBreakdown[] = []

    // Foundation (15% of total cost)
    const foundationCost = baseCostPerSqm * input.area * 0.15
    items.push({
      category: 'Foundation',
      item: 'Concrete foundation and footings',
      unitCost: foundationCost / input.area,
      quantity: input.area,
      total: foundationCost
    })

    // Walls and Structure (35% of total cost)
    const wallsCost = baseCostPerSqm * input.area * 0.35
    items.push({
      category: 'Walls & Structure',
      item: 'Block work, columns, and beams',
      unitCost: wallsCost / input.area,
      quantity: input.area,
      total: wallsCost
    })

    // Roofing (20% of total cost)
    const roofingCost = baseCostPerSqm * input.area * 0.20
    items.push({
      category: 'Roofing',
      item: 'Roofing sheets, trusses, and ceiling',
      unitCost: roofingCost / input.area,
      quantity: input.area,
      total: roofingCost
    })

    // Finishes (20% of total cost)
    const finishesCost = baseCostPerSqm * input.area * 0.20
    items.push({
      category: 'Finishes',
      item: 'Plastering, painting, and flooring',
      unitCost: finishesCost / input.area,
      quantity: input.area,
      total: finishesCost
    })

    // Services (10% of total cost)
    const servicesCost = baseCostPerSqm * input.area * 0.10
    items.push({
      category: 'Services',
      item: 'Electrical and plumbing installations',
      unitCost: servicesCost / input.area,
      quantity: input.area,
      total: servicesCost
    })

    // Calculate material quantities based on area
    const cementBags = Math.ceil(input.area * 2.5) // 2.5 bags per sqm average
    const blocks = Math.ceil(input.area * 45) // 45 blocks per sqm average
    const sandTonnes = Math.ceil(input.area * 0.15) // 0.15 tonnes per sqm
    
    const cementPrice = materials.find(m => m.item === 'CEMENT')?.priceNGN || 8500
    const blockPrice = materials.find(m => m.item === 'BLOCKS_9INCH')?.priceNGN || 320
    const sandPrice = materials.find(m => m.item === 'SAND')?.priceNGN || 45000

    materialBreakdown.push(
      {
        item: 'Cement',
        unit: '50kg bags',
        quantity: cementBags,
        unitPrice: cementPrice,
        total: cementBags * cementPrice
      },
      {
        item: '9-inch Blocks',
        unit: 'pieces',
        quantity: blocks,
        unitPrice: blockPrice,
        total: blocks * blockPrice
      },
      {
        item: 'Sharp Sand',
        unit: 'tonnes',
        quantity: sandTonnes,
        unitPrice: sandPrice / 20, // Price per tonne
        total: sandTonnes * (sandPrice / 20)
      }
    )

    return { items, materials: materialBreakdown }
  }

  private static runMonteCarloSimulation(baseCost: number, iterations: number) {
    const results: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      // Material volatility ±15%
      const materialVariation = 1 + (Math.random() - 0.5) * 0.3 // ±15%
      
      // Labour volatility ±10%
      const labourVariation = 1 + (Math.random() - 0.5) * 0.2 // ±10%
      
      // Market conditions ±5%
      const marketVariation = 1 + (Math.random() - 0.5) * 0.1 // ±5%
      
      const simulatedCost = baseCost * materialVariation * labourVariation * marketVariation
      results.push(simulatedCost)
    }
    
    results.sort((a, b) => a - b)
    
    return {
      percentile5: results[Math.floor(iterations * 0.05)],
      percentile95: results[Math.floor(iterations * 0.95)],
      mean: results.reduce((sum, val) => sum + val, 0) / iterations
    }
  }
}
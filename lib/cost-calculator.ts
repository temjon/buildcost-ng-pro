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
  private static readonly CONSTRUCTION_RATES = {
    BASIC: 161460,
    MEDIUM: 242190,
    LUXURY: 322920
  }

  private static readonly LOCATION_MULTIPLIERS = {
    LAGOS: 1.25,
    ABUJA: 1.20,
    PORT_HARCOURT: 1.15,
    ENUGU: 1.10,
    RURAL: 1.00
  }

  static async calculateEstimate(input: EstimateInput): Promise<CostEstimate> {
    // Get base construction rate
    const baseRate = this.CONSTRUCTION_RATES[input.finish as keyof typeof this.CONSTRUCTION_RATES] || 242190
    
    // Get location multiplier
    const locationMultiplier = this.LOCATION_MULTIPLIERS[input.location as keyof typeof this.LOCATION_MULTIPLIERS] || 1.0
    
    // Calculate base cost
    const baseCostPerSqm = baseRate * locationMultiplier
    const baseTotalCost = baseCostPerSqm * input.area

    // Calculate detailed cost breakdown
    const costBreakdown = this.calculateDetailedBreakdown(input, baseCostPerSqm)
    
    // Run Monte Carlo simulation for uncertainty analysis
    const monteCarloResults = this.runMonteCarloSimulation(baseTotalCost, 1000)
    
    return {
      total: Math.round(baseTotalCost),
      low: Math.round(monteCarloResults.percentile5),
      high: Math.round(monteCarloResults.percentile95),
      items: costBreakdown.items,
      materials: costBreakdown.materials,
      confidence: 0.9
    }
  }

  private static calculateDetailedBreakdown(input: EstimateInput, baseCostPerSqm: number) {
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

    // Calculate material quantities
    const cementBags = Math.ceil(input.area * 2.5)
    const blocks = Math.ceil(input.area * 45)
    const sandTonnes = Math.ceil(input.area * 0.15)

    materialBreakdown.push(
      {
        item: 'Cement',
        unit: '50kg bags',
        quantity: cementBags,
        unitPrice: 8500,
        total: cementBags * 8500
      },
      {
        item: '9-inch Blocks',
        unit: 'pieces',
        quantity: blocks,
        unitPrice: 320,
        total: blocks * 320
      },
      {
        item: 'Sharp Sand',
        unit: 'tonnes',
        quantity: sandTonnes,
        unitPrice: 2250,
        total: sandTonnes * 2250
      }
    )

    return { items, materials: materialBreakdown }
  }

  private static runMonteCarloSimulation(baseCost: number, iterations: number) {
    const results: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const materialVariation = 1 + (Math.random() - 0.5) * 0.3
      const labourVariation = 1 + (Math.random() - 0.5) * 0.2
      const marketVariation = 1 + (Math.random() - 0.5) * 0.1
      
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

import { NextRequest, NextResponse } from 'next/server'
import { CostCalculator } from '@/lib/cost-calculator'
import { z } from 'zod'

const EstimateSchema = z.object({
  area: z.number().min(10).max(10000),
  location: z.enum(['LAGOS', 'ABUJA', 'PORT_HARCOURT', 'ENUGU', 'RURAL']),
  finish: z.enum(['BASIC', 'MEDIUM', 'LUXURY'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = EstimateSchema.parse(body)
    
    // Calculate estimate
    const estimate = await CostCalculator.calculateEstimate(validatedData)
    
    return NextResponse.json(estimate)
  } catch (error) {
    console.error('Error calculating estimate:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to calculate estimate' },
      { status: 500 }
    )
  }
}
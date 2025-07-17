import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateMaterialSchema = z.object({
  id: z.string(),
  priceNGN: z.number().min(0)
})

export async function GET() {
  try {
    const materials = await prisma.materialPrice.findMany({
      orderBy: { item: 'asc' }
    })
    
    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = UpdateMaterialSchema.parse(body)
    
    const updatedMaterial = await prisma.materialPrice.update({
      where: { id: validatedData.id },
      data: { 
        priceNGN: validatedData.priceNGN,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json(updatedMaterial)
  } catch (error) {
    console.error('Error updating material:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    )
  }
}
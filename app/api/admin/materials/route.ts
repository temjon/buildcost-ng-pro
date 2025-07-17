import { NextRequest, NextResponse } from 'next/server'

const mockMaterials = [
  { id: '1', item: 'CEMENT', unit: '50kg bag', priceNGN: 8500, location: 'NATIONAL', updatedAt: new Date().toISOString() },
  { id: '2', item: 'BLOCKS_9INCH', unit: 'piece', priceNGN: 320, location: 'NATIONAL', updatedAt: new Date().toISOString() },
  { id: '3', item: 'SAND', unit: '20 tonnes', priceNGN: 45000, location: 'NATIONAL', updatedAt: new Date().toISOString() }
]

export async function GET() {
  return NextResponse.json(mockMaterials)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For now, just return success
    return NextResponse.json({
      id: body.id,
      priceNGN: body.priceNGN,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    )
  }
}

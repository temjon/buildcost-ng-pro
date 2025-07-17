import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Return empty array for now - database integration coming soon
  return NextResponse.json([])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For now, just return the data back
    return NextResponse.json({
      id: 'demo-' + Date.now(),
      ...body,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

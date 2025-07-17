import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // PDF generation feature coming soon
    return NextResponse.json({
      message: 'PDF generation feature coming soon!',
      data: body
    })
  } catch (error) {
    console.error('Error in PDF route:', error)
    return NextResponse.json(
      { error: 'PDF service temporarily unavailable' },
      { status: 500 }
    )
  }
}

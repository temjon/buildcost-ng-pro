import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  area: z.number().min(10).max(10000),
  location: z.string(),
  finish: z.string(),
  totalCost: z.number(),
  lowCost: z.number(),
  highCost: z.number(),
  userId: z.string().optional() // Will be from session in real app
})

export async function GET(request: NextRequest) {
  try {
    // In a real app, get userId from session
    const userId = 'demo-user' // Placeholder
    
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        costItems: true
      }
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = CreateProjectSchema.parse({
      ...body,
      userId: 'demo-user' // Placeholder - would come from session
    })
    
    const project = await prisma.project.create({
      data: validatedData
    })
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
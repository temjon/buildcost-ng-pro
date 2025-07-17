'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  area: number
  location: string
  finish: string
  totalCost: number
  lowCost: number
  highCost: number
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLocationLabel = (location: string) => {
    const labels: Record<string, string> = {
      'LAGOS': 'Lagos',
      'ABUJA': 'Abuja',
      'PORT_HARCOURT': 'Port Harcourt',
      'ENUGU': 'Enugu',
      'RURAL': 'Rural Areas'
    }
    return labels[location] || location
  }

  const getFinishLabel = (finish: string) => {
    const labels: Record<string, string> = {
      'BASIC': 'Basic',
      'MEDIUM': 'Medium',
      'LUXURY': 'Luxury'
    }
    return labels[finish] || finish
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Projects
          </h1>
          <p className="text-gray-600">
            View and manage your saved construction cost estimates
          </p>
        </div>
        <Link href="/calculate" className="btn-primary">
          New Estimate
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first construction cost estimate to get started
          </p>
          <Link href="/calculate" className="btn-primary">
            Calculate Your First Estimate
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {project.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDate(project.createdAt)}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">{project.area} m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{getLocationLabel(project.location)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Finish:</span>
                  <span className="font-medium">{getFinishLabel(project.finish)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(project.totalCost)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Range: {formatCurrency(project.lowCost)} - {formatCurrency(project.highCost)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="btn-secondary flex-1 text-sm">
                    View Details
                  </button>
                  <button className="btn-primary flex-1 text-sm">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
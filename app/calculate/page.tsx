'use client'

import { useState } from 'react'
import { CostEstimate } from '@/lib/cost-calculator'

export default function CalculatePage() {
  const [formData, setFormData] = useState({
    area: 100,
    location: 'LAGOS',
    finish: 'MEDIUM'
  })
  const [estimate, setEstimate] = useState<CostEstimate | null>(null)
  const [loading, setLoading] = useState(false)
  const [unit, setUnit] = useState<'sqm' | 'sqft'>('sqm')

  const locations = [
    { value: 'LAGOS', label: 'Lagos (×1.25)' },
    { value: 'ABUJA', label: 'Abuja (×1.20)' },
    { value: 'PORT_HARCOURT', label: 'Port Harcourt (×1.15)' },
    { value: 'ENUGU', label: 'Enugu (×1.10)' },
    { value: 'RURAL', label: 'Rural Areas (×1.00)' }
  ]

  const finishes = [
    { value: 'BASIC', label: 'Basic (₦161,460/m²)', color: 'bg-gray-100' },
    { value: 'MEDIUM', label: 'Medium (₦242,190/m²)', color: 'bg-blue-100' },
    { value: 'LUXURY', label: 'Luxury (₦322,920/m²)', color: 'bg-purple-100' }
  ]

  const convertArea = (area: number, from: 'sqm' | 'sqft', to: 'sqm' | 'sqft') => {
    if (from === to) return area
    return from === 'sqm' ? area * 10.764 : area / 10.764
  }

  const displayArea = unit === 'sqm' ? formData.area : convertArea(formData.area, 'sqm', 'sqft')

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to calculate estimate')
      
      const result = await response.json()
      setEstimate(result)
    } catch (error) {
      console.error('Error calculating estimate:', error)
      alert('Failed to calculate estimate. Please try again.')
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Construction Cost Calculator
        </h1>
        <p className="text-gray-600">
          Get instant ±10% accurate estimates using 2025 Nigerian market data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Project Details</h2>
          
          {/* Area Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="label">Building Area</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setUnit('sqm')}
                  className={`px-3 py-1 rounded text-sm ${unit === 'sqm' ? 'bg-white shadow' : ''}`}
                >
                  m²
                </button>
                <button
                  onClick={() => setUnit('sqft')}
                  className={`px-3 py-1 rounded text-sm ${unit === 'sqft' ? 'bg-white shadow' : ''}`}
                >
                  ft²
                </button>
              </div>
            </div>
            <input
              type="range"
              min={unit === 'sqm' ? 50 : 538}
              max={unit === 'sqm' ? 500 : 5382}
              value={displayArea}
              onChange={(e) => {
                const newArea = parseFloat(e.target.value)
                setFormData({
                  ...formData,
                  area: unit === 'sqm' ? newArea : convertArea(newArea, 'sqft', 'sqm')
                })
              }}
              className="w-full mb-2"
            />
            <div className="text-center text-lg font-semibold">
              {Math.round(displayArea)} {unit}
            </div>
          </div>

          {/* Location Selection */}
          <div className="mb-6">
            <label className="label">Location</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input"
            >
              {locations.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Finish Selection */}
          <div className="mb-6">
            <label className="label">Finish Level</label>
            <div className="space-y-3">
              {finishes.map(finish => (
                <label key={finish.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="finish"
                    value={finish.value}
                    checked={formData.finish === finish.value}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="mr-3"
                  />
                  <div className={`flex-1 p-3 rounded-lg ${finish.color}`}>
                    <div className="font-medium">{finish.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="btn-primary w-full text-lg py-3"
          >
            {loading ? 'Calculating...' : 'Calculate Cost'}
          </button>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Cost Estimate</h2>
          
          {estimate ? (
            <div className="space-y-6">
              {/* Total Cost */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Estimated Total Cost</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(estimate.total)}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Range: {formatCurrency(estimate.low)} - {formatCurrency(estimate.high)}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">Cost Breakdown</h3>
                <div className="space-y-2">
                  {estimate.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <div>
                        <div className="font-medium">{item.category}</div>
                        <div className="text-sm text-gray-600">{item.item}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.total)}</div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(item.unitCost)}/m²
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">Key Materials</h3>
                <div className="space-y-2">
                  {estimate.materials.map((material, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <div>
                        <div className="font-medium">{material.item}</div>
                        <div className="text-sm text-gray-600">
                          {material.quantity} {material.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(material.total)}</div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(material.unitPrice)}/{material.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="btn-primary flex-1">
                  Download PDF
                </button>
                <button className="btn-secondary flex-1">
                  Save Project
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>Enter your project details and click "Calculate Cost" to see your estimate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
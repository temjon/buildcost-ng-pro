'use client'

import { useState, useEffect } from 'react'

interface MaterialPrice {
  id: string
  item: string
  unit: string
  priceNGN: number
  location: string
  updatedAt: string
}

export default function AdminPage() {
  const [materials, setMaterials] = useState<MaterialPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/admin/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (material: MaterialPrice) => {
    setEditingId(material.id)
    setEditPrice(material.priceNGN.toString())
  }

  const handleSave = async (id: string) => {
    try {
      const response = await fetch('/api/admin/materials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          priceNGN: parseFloat(editPrice)
        })
      })

      if (response.ok) {
        await fetchMaterials()
        setEditingId(null)
        setEditPrice('')
      }
    } catch (error) {
      console.error('Error updating material price:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditPrice('')
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading material prices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage material prices and system settings
        </p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Material Prices (2025)</h2>
          <div className="text-sm text-gray-600">
            Last updated: {materials.length > 0 ? formatDate(materials[0].updatedAt) : 'Never'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Material</th>
                <th className="text-left py-3 px-4 font-semibold">Unit</th>
                <th className="text-left py-3 px-4 font-semibold">Price (₦)</th>
                <th className="text-left py-3 px-4 font-semibold">Location</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{material.item.replace(/_/g, ' ')}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {material.unit}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === material.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="input w-32"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">
                        {formatCurrency(material.priceNGN)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {material.location}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === material.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(material.id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">
                Price Update Guidelines
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Prices should reflect current Nigerian market rates</li>
                <li>• Consider regional variations and inflation factors</li>
                <li>• Update prices monthly or when significant market changes occur</li>
                <li>• All changes are logged and affect future estimates immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
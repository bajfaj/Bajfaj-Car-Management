import { useState, useEffect } from 'react'

export default function EditCarModal({ isOpen, onClose, onSave, car }) {
  const [formData, setFormData] = useState({
    registration: '',
    brand: '',
    model: '',
    purchaseYear: '',
    colour: '',
    engine: '',
    fuel: '',
    totalSpent: '',
  })

  useEffect(() => {
    if (car) {
      setFormData({
        registration: car.registration || '',
        brand: car.brand || '',
        model: car.model || '',
        purchaseYear: car.purchaseYear || '',
        colour: car.colour || '',
        engine: car.engine || '',
        fuel: car.fuel || '',
        totalSpent: car.totalSpent || '',
      })
    }
  }, [car])

  if (!isOpen ||!car) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedCar = {
    ...car,
    ...formData,
      purchaseYear: Number(formData.purchaseYear),
      totalSpent: Number(formData.totalSpent),
      profit: car.status === 'Sold' 
      ? (car.saleAmount || 0) - Number(formData.totalSpent)
        : 0 - Number(formData.totalSpent)
    }
    onSave(updatedCar)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h- overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Edit Car</h3>
            <p className="text-sm text-gray-500">{car.registration} - {car.brand} {car.model}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Registration *</label>
              <input 
                name="registration" 
                type="text" 
                value={formData.registration} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Brand *</label>
              <input 
                name="brand" 
                type="text" 
                value={formData.brand} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Model *</label>
              <input 
                name="model" 
                type="text" 
                value={formData.model} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Purchase Year *</label>
              <input 
                name="purchaseYear" 
                type="number" 
                value={formData.purchaseYear} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Colour *</label>
              <input 
                name="colour" 
                type="text" 
                value={formData.colour} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Engine *</label>
              <input 
                name="engine" 
                type="text" 
                value={formData.engine} 
                onChange={handleChange} 
                placeholder="e.g. 1.6" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type *</label>
              <select 
                name="fuel" 
                value={formData.fuel} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500"
              >
                <option value="" disabled>Select fuel type</option>
                <option value="PETROL" className="text-gray-900">PETROL</option>
                <option value="DIESEL" className="text-gray-900">DIESEL</option>
                <option value="HYBRID" className="text-gray-900">HYBRID</option>
                <option value="ELECTRIC" className="text-gray-900">ELECTRIC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Total Spent £ *</label>
              <input 
                name="totalSpent" 
                type="number" 
                value={formData.totalSpent} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
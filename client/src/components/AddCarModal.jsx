import { useState, useEffect } from 'react'

export default function AddCarModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    registration: '',
    brand: '',
    model: '',
    colour: '',
    engine: '',
    transmission: '',
    fuel: '',
    logbook: '',
    purchaseYear: '',
    source: '',
    winningBid: '',
    additionalFee: '',
    delivery: '',
    repairCost: '',
    mechanic: '',
    personalUse: '',
    mileagePurchase: '',
  })

  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    const bid = Number(formData.winningBid) || 0
    const fee = Number(formData.additionalFee) || 0
    const del = Number(formData.delivery) || 0
    const repair = Number(formData.repairCost) || 0
    setTotalSpent(bid + fee + del + repair)
  }, [formData.winningBid, formData.additionalFee, formData.delivery, formData.repairCost])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    const newValue = name === 'registration'? value.toUpperCase() : value
    setFormData(prev => ({...prev, [name]: newValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCar = {
   ...formData,
      totalSpent,
      id: Date.now(),
      status: 'Held',
      saleAmount: 0,
      profit: -totalSpent,
      saleYear: null,
      advertDuration: null,
      advertisedOn: null,
      platformSoldOn: null,
      mileageSale: null,
    }
    onSave(newCar)
    onClose()
    setFormData({
      registration: '',
      brand: '',
      model: '',
      colour: '',
      engine: '',
      transmission: '',
      fuel: '',
      logbook: '',
      purchaseYear: '',
      source: '',
      winningBid: '',
      additionalFee: '',
      delivery: '',
      repairCost: '',
      mechanic: '',
      personalUse: '',
      mileagePurchase: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">Add New Car</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="overflow-y-auto p-6 min-h-0">
          <form id="add-car-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Car Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="registration" value={formData.registration} onChange={handleChange} placeholder="Registration e.g. AB12 CDE" required className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="model" value={formData.model} onChange={handleChange} placeholder="Model" required className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="colour" value={formData.colour} onChange={handleChange} placeholder="Colour" className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="engine" value={formData.engine} onChange={handleChange} placeholder="Engine e.g. 1.6" className="px-3 py-2 border border-gray-300 rounded-md" />
                
                <select name="transmission" value={formData.transmission} onChange={handleChange} required className="px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                  <option value="" disabled>Select Transmission Type</option>
                  <option value="MANUAL" className="text-gray-900">MANUAL</option>
                  <option value="AUTOMATIC" className="text-gray-900">AUTOMATIC</option>
                </select>
                
                <select name="fuel" value={formData.fuel} onChange={handleChange} required className="px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                  <option value="" disabled>Select Fuel Type</option>
                  <option value="PETROL" className="text-gray-900">PETROL</option>
                  <option value="DIESEL" className="text-gray-900">DIESEL</option>
                  <option value="HYBRID" className="text-gray-900">HYBRID</option>
                  <option value="ELECTRIC" className="text-gray-900">ELECTRIC</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Purchase Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="purchaseYear" type="number" value={formData.purchaseYear} onChange={handleChange} placeholder="Purchase Year" required className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="source" value={formData.source} onChange={handleChange} placeholder="Source e.g. COPART - YORK" className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="mechanic" value={formData.mechanic} onChange={handleChange} placeholder="Mechanic" className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="winningBid" type="number" value={formData.winningBid} onChange={handleChange} placeholder="Winning Bid" className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="additionalFee" type="number" value={formData.additionalFee} onChange={handleChange} placeholder="Additional Fee" className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="delivery" type="number" value={formData.delivery} onChange={handleChange} placeholder="Delivery Cost" className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="repairCost" type="number" value={formData.repairCost} onChange={handleChange} placeholder="Repair Cost" className="px-3 py-2 border border-gray-300 rounded-md" />
                <input name="mileagePurchase" type="number" value={formData.mileagePurchase} onChange={handleChange} placeholder="Mileage at Purchase" className="px-3 py-2 border border-gray-300 rounded-md" />
                
                <select name="logbook" value={formData.logbook} onChange={handleChange} required className="px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                  <option value="" disabled>Logbook Available?</option>
                  <option value="YES" className="text-gray-900">Yes</option>
                  <option value="NO" className="text-gray-900">No</option>
                </select>

                <select name="personalUse" value={formData.personalUse} onChange={handleChange} required className="px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                  <option value="" disabled>Personal Use?</option>
                  <option value="YES" className="text-gray-900">Yes</option>
                  <option value="NO" className="text-gray-900">No</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Amount Spent:</span>
                <span className="text-xl font-bold text-gray-900">£{totalSpent.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Auto: Bid + Fee + Delivery + Repair</p>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-car-form"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Car
          </button>
        </div>

      </div>
    </div>
  )
}
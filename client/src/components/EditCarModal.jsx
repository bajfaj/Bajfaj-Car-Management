import { useState, useEffect } from 'react'

export default function EditCarModal({ isOpen, onClose, onSave, car }) {
  const [formData, setFormData] = useState({
    registration: '', brand: '', model: '', colour: '', engine: '', transmission: '', fuel: '',
    logbook: '', purchaseYear: '', source: '', winningBid: '', additionalFee: '', delivery: '',
    repairCost: '', mechanic: '', personalUse: '', mileagePurchase: '', totalSpent: '',
    saleAmount: '', saleYear: ''
  })

  const isSold = car?.status === 'Sold'

  useEffect(() => {
    if (car) {
      setFormData({
        registration: car.registration || '', brand: car.brand || '', model: car.model || '',
        colour: car.colour || '', engine: car.engine || '', transmission: car.transmission || '',
        fuel: car.fuel || '', logbook: car.logbook || '', purchaseYear: car.purchaseYear || '',
        source: car.source || '', winningBid: car.winningBid || '', additionalFee: car.additionalFee || '',
        delivery: car.delivery || '', repairCost: car.repairCost || '', mechanic: car.mechanic || '',
        personalUse: car.personalUse || '', mileagePurchase: car.mileagePurchase || '',
        totalSpent: car.totalSpent || '',
        saleAmount: car.saleAmount || '',
        saleYear: car.saleYear || ''
      })
    }
  }, [car])

  if (!isOpen ||!car) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    const newValue = name === 'registration'? value.toUpperCase() : value
    setFormData(prev => ({...prev, [name]: newValue }))
  }

  const liveProfit = (Number(formData.saleAmount) || 0) - (Number(formData.totalSpent) || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedCar = {
  ...car,
  ...formData,
      purchaseYear: Number(formData.purchaseYear) || 0,
      winningBid: Number(formData.winningBid) || 0,
      additionalFee: Number(formData.additionalFee) || 0,
      delivery: Number(formData.delivery) || 0,
      repairCost: Number(formData.repairCost) || 0,
      mileagePurchase: Number(formData.mileagePurchase) || 0,
      totalSpent: Number(formData.totalSpent) || 0,
      saleAmount: Number(formData.saleAmount) || 0,
      saleYear: Number(formData.saleYear) || 0,
      profit: isSold? liveProfit : -(Number(formData.totalSpent) || 0)
    }
    onSave(updatedCar)
    onClose()
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
  const selectClass = "w-full px-3 py-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const disabledClass = "w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
  const labelClass = "block text-xs font-medium text-gray-700 mb-1"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" style={{maxHeight: '90vh', display: 'flex', flexDirection: 'column'}}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{isSold? 'Edit Sale' : 'Edit Car'}</h3>
              <p className="text-sm text-gray-500">{car.registration} - {car.brand} {car.model}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
        </div>

        {/* Body with inline style scroll - CANT FAIL */}
        <div style={{overflowY: 'auto', padding: '1.5rem'}}>
          <form id="edit-car-form" onSubmit={handleSubmit} className="space-y-4">
            
            {!isSold && (
              <>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Car Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Registration</label><input name="registration" value={formData.registration} onChange={handleChange} required className={inputClass} /></div>
                    <div><label className={labelClass}>Brand</label><input name="brand" value={formData.brand} onChange={handleChange} required className={inputClass} /></div>
                    <div><label className={labelClass}>Model</label><input name="model" value={formData.model} onChange={handleChange} required className={inputClass} /></div>
                    <div><label className={labelClass}>Colour</label><input name="colour" value={formData.colour} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Engine</label><input name="engine" value={formData.engine} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Transmission</label><select name="transmission" value={formData.transmission} onChange={handleChange} className={selectClass}><option value="">Select</option><option value="Manual">MANUAL</option><option value="Automatic">AUTOMATIC</option></select></div>
                    <div className="md:col-span-2"><label className={labelClass}>Fuel</label><select name="fuel" value={formData.fuel} onChange={handleChange} required className={selectClass}><option value="">Select</option><option value="PETROL">PETROL</option><option value="DIESEL">DIESEL</option><option value="HYBRID">HYBRID</option><option value="ELECTRIC">ELECTRIC</option></select></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Purchase Info</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Purchase Year</label><input name="purchaseYear" type="number" value={formData.purchaseYear} onChange={handleChange} required className={inputClass} /></div>
                    <div><label className={labelClass}>Source</label><input name="source" value={formData.source} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Mechanic</label><input name="mechanic" value={formData.mechanic} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Winning Bid</label><input name="winningBid" type="number" value={formData.winningBid} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Additional Fee</label><input name="additionalFee" type="number" value={formData.additionalFee} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Delivery Cost</label><input name="delivery" type="number" value={formData.delivery} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Repair Cost</label><input name="repairCost" type="number" value={formData.repairCost} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Mileage at Purchase</label><input name="mileagePurchase" type="number" value={formData.mileagePurchase} onChange={handleChange} className={inputClass} /></div>
                    <div><label className={labelClass}>Logbook</label><select name="logbook" value={formData.logbook} onChange={handleChange} className={selectClass}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
                    <div><label className={labelClass}>Personal Use</label><select name="personalUse" value={formData.personalUse} onChange={handleChange} className={selectClass}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
                    <div className="md:col-span-2"><label className={labelClass}>Total Amount Spent</label><input name="totalSpent" type="number" value={formData.totalSpent} disabled className={disabledClass} /></div>
                  </div>
                </div>
              </>
            )}

            {isSold && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Sale Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Sale Amount</label><input name="saleAmount" type="number" value={formData.saleAmount} onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>Sale Year</label><input name="saleYear" type="number" value={formData.saleYear} onChange={handleChange} required className={inputClass} /></div>
                  <div className="md:col-span-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-600">Total Spent: £{car.totalSpent?.toLocaleString() || 0}</p>
                    <p className={`text-sm font-bold ${liveProfit >= 0? 'text-green-600' : 'text-red-600'}`}>
                      Profit: £{liveProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" form="edit-car-form" className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isSold? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSold? 'Save Sale' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
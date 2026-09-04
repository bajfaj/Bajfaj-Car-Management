import { useState, useEffect } from 'react'

const PLATFORMS = ['AUTOTRADER', 'FACEBOOK', 'EBAY', 'GUMTREE', 'PRIVATE', 'OTHER']

export default function SellCarModal({ isOpen, onClose, onSave, car }) {
  const [formData, setFormData] = useState({
    saleAmount: '',
    saleYear: '',
    platformSoldOn: '',
    advertisedPlatforms: [],
    mileageSale: '',
    advertDuration: '',
  })

  const [error, setError] = useState('') // CHANGED: use error state instead of alert
  const [profit, setProfit] = useState(0)

  useEffect(() => {
    if (!car) return
    const sale = Number(formData.saleAmount) || 0
    setProfit(sale - (car.totalSpent || 0)) // <-- totalSpent matches DB now
  }, [formData.saleAmount, car])

  if (!isOpen ||!car) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value }))
  }

  const handleCheckboxChange = (platform) => {
    setFormData(prev => {
      const platforms = prev.advertisedPlatforms.includes(platform)
   ? prev.advertisedPlatforms.filter(p => p!== platform)
        : [...prev.advertisedPlatforms, platform]
      return {...prev, advertisedPlatforms: platforms }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('') // CHANGED

    // CHANGED: Full validation
    if (!formData.saleAmount ||!formData.saleYear ||!formData.platformSoldOn) {
      setError('Sale Amount, Sale Year and Platform Sold On are required')
      return
    }
    if (formData.advertisedPlatforms.length === 0) {
      setError('Please select at least one Advertised Platform')
      return
    }

    // FIXED: Use advertisedPlatforms for DB and don't send array twice
    const { advertisedPlatforms: selectedPlatforms,...restFormData } = formData;

    const updatedCar = {
     ...car,
     ...restFormData,
      saleAmount: Number(formData.saleAmount), // <-- saleAmount matches DB
      mileageSale: Number(formData.mileageSale) || 0,
      saleYear: Number(formData.saleYear), // <-- saleYear matches DB
      advertisedPlatforms: selectedPlatforms.join(', '), // FIXED: was advertisedOn, now advertisedPlatforms
      profit, // <-- profit matches DB
      status: 'Sold',
    }

    onSave(updatedCar) // PESSIMISTIC: parent will refetch
    onClose()
    setFormData({
      saleAmount: '',
      saleYear: '',
      platformSoldOn: '',
      advertisedPlatforms: [],
      mileageSale: '',
      advertDuration: '',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen flex-col">

        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Mark as Sold</h3>
            <p className="text-sm text-gray-500">{car.registration} - {car.make} {car.model}</p> {/* <-- make */}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 min-h-0">
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>} {/* NEW */}
          <form id="sell-car-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sale Amount £ *</label>
                <input
                  name="saleAmount"
                  type="number"
                  value={formData.saleAmount}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  required
                  className="w-full px-3 py-2 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sale Year *</label>
                <input
                  name="saleYear"
                  type="number"
                  value={formData.saleYear}
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  required
                  className="w-full px-3 py-2 border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Platform Sold On *</label>
                <select
                  name="platformSoldOn"
                  value={formData.platformSoldOn}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" // FIX: text-gray-900 not 500
                >
                  <option value="" disabled>Select platform</option>
                  {PLATFORMS.map(p => (
                    <option key={p} value={p} className="text-gray-900">{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mileage at Sale</label>
                <input
                  name="mileageSale"
                  type="number"
                  value={formData.mileageSale}
                  onChange={handleChange}
                  placeholder="e.g. 85000"
                  className="w-full px-3 py-2 border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Advert Duration</label>
                <input
                  name="advertDuration"
                  type="text"
                  value={formData.advertDuration}
                  onChange={handleChange}
                  placeholder="e.g. 14 days, 3 weeks, 1 month"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Advertised Platform <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border border-gray-300 rounded-md">
                {PLATFORMS.map(platform => (
                  <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.advertisedPlatforms.includes(platform)}
                      onChange={() => handleCheckboxChange(platform)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Total Spent:</span>
                <span className="text-sm font-medium text-gray-900">£{car.totalSpent?.toLocaleString() || 0}</span> {/* <-- totalSpent */}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Sale Amount:</span>
                <span className="text-sm font-medium text-gray-900">£{(Number(formData.saleAmount) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Profit:</span>
                <span className={`text-lg font-bold ${profit >= 0? 'text-green-600' : 'text-red-600'}`}>
                  £{profit.toLocaleString()}
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed with buttons OUTSIDE form */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="sell-car-form"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Confirm Sale
          </button>
        </div>

      </div>
    </div>
  )
}
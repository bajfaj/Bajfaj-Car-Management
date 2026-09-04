import { useEffect, useState } from 'react'

export default function ReportsPage() {
  const [cars, setCars] = useState([])
  const [yearFilter, setYearFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Get unique years and brands for filters
  const years = ['All', ...new Set(cars.map(c => c.saleYear).filter(Boolean))].sort((a,b) => b-a)
  const brands = ['All', ...new Set(cars.map(c => c.brand).filter(Boolean))]

  // Apply filters
  const filteredCars = cars.filter(c => {
    const yearMatch = yearFilter === 'All' || c.saleYear === parseInt(yearFilter)
    const brandMatch = brandFilter === 'All' || c.brand === brandFilter
    return yearMatch && brandMatch
  })

  // KPIs
  const totalCars = filteredCars.length
  const mostExpensive = filteredCars.reduce((max, c) => (c.saleAmount || 0) > (max.saleAmount || 0) ? c : max, {})
  const mostProfit = filteredCars.reduce((max, c) => (c.profit || 0) > (max.profit || 0) ? c : max, {})
  const biggestLoss = filteredCars.reduce((min, c) => (c.profit || 0) < (min.profit || 0) ? c : min, {})

  if (loading) return <p>Loading reports...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports / Analytics</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border-gray-200 mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="border rounded px-3 py-2">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="border rounded px-3 py-2">
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-gray-200">
          <p className="text-sm text-gray-500">Total Cars</p>
          <p className="text-2xl font-bold">{totalCars}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-gray-200">
          <p className="text-sm text-gray-500">Most Expensive</p>
          <p className="text-lg font-bold">{mostExpensive.brand} {mostExpensive.model}</p>
          <p className="text-sm text-green-600">£{(mostExpensive.saleAmount || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-gray-200">
          <p className="text-sm text-gray-500">Most Profit</p>
          <p className="text-lg font-bold">{mostProfit.brand} {mostProfit.model}</p>
          <p className="text-sm text-green-600">£{(mostProfit.profit || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-gray-200">
          <p className="text-sm text-gray-500">Biggest Loss</p>
          <p className="text-lg font-bold">{biggestLoss.brand} {biggestLoss.model}</p>
          <p className="text-sm text-red-600">£{(biggestLoss.profit || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Registration</th>
              <th className="p-3">Make</th>
              <th className="p-3">Model</th>
              <th className="p-3">Sale Year</th>
              <th className="p-3">Sale Price</th>
              <th className="p-3">Profit</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-6 text-gray-400">No data for selected filters</td></tr>
            ) : (
              filteredCars.map(car => (
                <tr key={car.id} className="border-t">
                  <td className="p-3">{car.registration}</td>
                  <td className="p-3">{car.brand}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3">{car.saleYear || '-'}</td>
                  <td className="p-3">£{(car.saleAmount || 0).toLocaleString()}</td>
                  <td className="p-3">£{(car.profit || 0).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
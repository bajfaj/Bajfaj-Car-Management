import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/cars')
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

  // KPI calculations
  const totalCars = cars.length
  const carsHeld = cars.filter(c => c.status === 'Held').length
  const carsSold = cars.filter(c => c.status === 'Sold').length
  const totalProfit = cars.reduce((sum, c) => sum + (c.profit || 0), 0)
  const avgProfit = carsSold > 0 ? totalProfit / carsSold : 0
  const currentYear = new Date().getFullYear()
  const soldThisYear = cars.filter(c => c.status === 'Sold' && c.saleYear === currentYear).length

  // Last 5 added cars
  const recentCars = [...cars].slice(0, 5)

  if (loading) return <p>Loading dashboard...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-gray-200">
          <p className="text-sm text-gray-500">Total Cars</p>
          <p className="text-2xl font-bold text-gray-900">{totalCars}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Cars Held</p>
          <p className="text-2xl font-bold text-blue-600">{carsHeld}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-gray-200">
          <p className="text-sm text-gray-500">Cars Sold</p>
          <p className="text-2xl font-bold text-green-600">{carsSold}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Sold This Year</p>
          <p className="text-2xl font-bold text-purple-600">{soldThisYear}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-gray-200">
          <p className="text-sm text-gray-500">Total Profit</p>
          <p className="text-2xl font-bold text-green-600">£{totalProfit.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Avg Profit / Sold Car</p>
          <p className="text-2xl font-bold text-green-600">£{avgProfit.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </div>
      </div>

      {/* Recent Cars Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Cars Added</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="pb-2">Registration</th>
                <th className="pb-2">Make</th>
                <th className="pb-2">Model</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Profit</th>
              </tr>
            </thead>
            <tbody>
              {recentCars.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-400">No cars yet</td></tr>
              ) : (
                recentCars.map(car => (
                  <tr key={car.id} className="border-b last:border-0">
                    <td className="py-2">{car.registration}</td>
                    <td className="py-2">{car.brand}</td>
                    <td className="py-2">{car.model}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        car.status === 'Sold' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="py-2">£{(car.profit || 0).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
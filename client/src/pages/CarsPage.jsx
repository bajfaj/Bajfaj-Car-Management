import { useEffect, useState } from 'react'

export default function CarsPage() {
  const [cars, setCars] = useState([])
  const [deletedCars, setDeletedCars] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch('http://localhost:3001/api/cars').then(res => res.json()),
      fetch('http://localhost:3001/api/cars/deleted').then(res => res.json())
    ]).then(([active, deleted]) => {
      setCars(active)
      setDeletedCars(deleted)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    const reason = prompt("Reason for deletion?")
    if (!reason) return
    await fetch(`http://localhost:3001/api/cars/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    fetchData()
  }

  const handleRestore = async (id) => {
    await fetch(`http://localhost:3001/api/cars/${id}/restore`, { method: 'PUT' })
    fetchData()
  }

  const handlePermanentDelete = async (id) => {
    if (!confirm("Permanently delete? This cannot be undone.")) return
    await fetch(`http://localhost:3001/api/cars/${id}/permanent`, { method: 'DELETE' })
    fetchData()
  }

  const tabs = ['All', 'Held', 'Sold', 'Deleted']
  
  const filteredCars = () => {
    if (activeTab === 'All') return cars
    if (activeTab === 'Deleted') return deletedCars
    return cars.filter(c => c.status === activeTab)
  }

  if (loading) return <p>Loading cars...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Car Inventory</h1>
        {activeTab !== 'Deleted' && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Car
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Registration</th>
              <th className="p-3">Make</th>
              <th className="p-3">Model</th>
              <th className="p-3">Status</th>
              <th className="p-3">Profit</th>
              {activeTab === 'Deleted' && <th className="p-3">Deleted Reason</th>}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars().length === 0 ? (
              <tr><td colSpan="7" className="text-center py-6 text-gray-400">No cars found</td></tr>
            ) : (
              filteredCars().map(car => (
                <tr key={car.id} className="border-t">
                  <td className="p-3">{car.registration}</td>
                  <td className="p-3">{car.brand}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      car.status === 'Sold' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="p-3">£{(car.profit || 0).toLocaleString()}</td>
                  {activeTab === 'Deleted' && <td className="p-3">{car.deleted_reason}</td>}
                  <td className="p-3 space-x-2">
                    {activeTab === 'Deleted' ? (
                      <>
                        <button onClick={() => handleRestore(car.id)} className="text-green-600 hover:underline">Restore</button>
                        <button onClick={() => handlePermanentDelete(car.id)} className="text-red-600 hover:underline">Delete Forever</button>
                      </>
                    ) : (
                      <>
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(car.id)} className="text-red-600 hover:underline">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
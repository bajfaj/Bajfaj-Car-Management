import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3001/api/cars'

export default function DeletedCarsPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDeletedCars = () => {
    fetch(`${API_URL}/deleted`)
   .then(res => res.json())
   .then(data => {
        setCars(data)
        setLoading(false)
      })
   .catch(err => {
        console.error('Failed to fetch deleted cars:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDeletedCars()
  }, [])

  const handleRestore = async (id) => {
    if (window.confirm('Restore this car back to inventory?')) {
      await fetch(`${API_URL}/${id}/restore`, { method: 'PUT' })
      await fetchDeletedCars()
    }
  }

  const handlePermanentDelete = async (id) => {
    if (window.confirm('Permanently delete this car? This cannot be undone.')) {
      await fetch(`${API_URL}/${id}/permanent`, { method: 'DELETE' })
      await fetchDeletedCars()
    }
  }

  if (loading) return <div className="p-4">Loading deleted cars...</div>

  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Deleted Cars</h2>
          <p className="text-sm text-gray-500 mt-1">Cars that have been removed. You can restore them or delete permanently.</p>
        </div>

        {cars.length === 0? (
          <div className="p-6 text-center text-gray-500">No deleted cars.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand/Model</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deleted Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deleted At</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map(car => (
                  <tr key={car.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{car.registration}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{car.brand} {car.model}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{car.deleted_reason || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {car.deleted_at ? new Date(car.deleted_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-3">
                      <button onClick={() => handleRestore(car.id)} className="text-green-600 hover:text-green-800 font-medium">Restore</button>
                      <button onClick={() => handlePermanentDelete(car.id)} className="text-red-600 hover:text-red-800 font-medium">Delete Forever</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
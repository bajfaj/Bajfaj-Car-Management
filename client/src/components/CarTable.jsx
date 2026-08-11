import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddCarModal from './AddCarModal'
import SellCarModal from './SellCarModal'
import EditCarModal from './EditCarModal'

const API_URL = 'http://localhost:3001/api/cars'

export default function CarTable() {
  const location = useLocation()
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteReason, setDeleteReason] = useState('Sold')
  const [deleteOtherReason, setDeleteOtherReason] = useState('')
  const [carToDelete, setCarToDelete] = useState(null)

  const [selectedCar, setSelectedCar] = useState(null)

  // Open Add Modal from navigation state
  useEffect(() => {
    if (location.state?.openAddModal) {
      setIsAddModalOpen(true)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // 1. LOAD CARS FROM API
  const fetchCars = () => {
    fetch(API_URL)
 .then(res => res.json())
 .then(data => {
        setCars(data)
        setLoading(false)
      })
 .catch(err => {
        console.error('Failed to fetch cars:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // 2. ADD CAR - POST to API
  const handleSaveCar = async (newCar) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar)
    })
    await res.json()
    await fetchCars()
    setIsAddModalOpen(false)
  }

  // 3. SELL/EDIT CAR - PUT to API
  const handleSellCar = async (updatedCar) => {
    await fetch(`${API_URL}/${updatedCar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCar)
    })
    await fetchCars()
    setIsSellModalOpen(false)
    setSelectedCar(null)
  }

  const handleEditCar = async (updatedCar) => {
    await fetch(`${API_URL}/${updatedCar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCar)
    })
    await fetchCars()
    setIsEditModalOpen(false)
    setSelectedCar(null)
  }

  // 4. DELETE CAR - Opens modal
  const openDeleteModal = (car) => {
    setCarToDelete(car)
    setDeleteReason('Sold')
    setDeleteOtherReason('')
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    const finalReason = deleteReason === 'Other'? deleteOtherReason.trim() : deleteReason;

    if (deleteReason === 'Other' &&!finalReason) {
      alert('Please enter a reason for deletion');
      return;
    }

    await fetch(`${API_URL}/${carToDelete.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: finalReason })
    })
    await fetchCars()
    setIsDeleteModalOpen(false)
    setCarToDelete(null)
  }

  const openSellModal = (car) => {
    setSelectedCar(car)
    setIsSellModalOpen(true)
  }

  const openEditModal = (car) => {
    setSelectedCar(car)
    setIsEditModalOpen(true)
  }

  if (loading) return <div className="p-4">Loading cars...</div>

  const ActionButtons = ({ car }) => (
  <div className="flex items-center gap-3">
    {car.status === 'Sold'? (
      <button
        onClick={() => openEditModal(car)}
        className="text-purple-600 hover:text-purple-800 font-medium"
      >
        Edit Sale
      </button>
    ) : (
      <button
        onClick={() => openEditModal(car)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Edit
      </button>
    )}
    
    {car.status === 'Held' && (
      <button
        onClick={() => openSellModal(car)}
        className="text-green-600 hover:text-green-800 font-medium"
      >
        Sell
      </button>
    )}
    
    <button
      onClick={() => openDeleteModal(car)}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Delete
    </button>
  </div>
)

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Car Inventory</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Car
          </button>
        </div>

        {cars.length === 0? (
          <div className="p-6 text-center text-gray-500">No cars yet. Click "Add Car" to get started.</div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-gray-200">
              {cars.map((car) => (
                <div key={car.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{car.registration}</p>
                      <p className="text-sm text-gray-700">{car.brand} {car.model}</p>
                      <p className="text-xs text-gray-500">{car.colour} • {car.engine} • {car.fuel}</p>
                      <p className="text-xs text-gray-500">Purchase Year: {car.purchaseYear}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      car.status === 'Sold'? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.status}
                    </span>
                  </div>
                  <div className="text-sm mt-2 pt-2 border-t space-y-1">
                    <p>Spent: £{car.totalSpent?.toLocaleString() || 0}</p>
                    {car.status === 'Sold' && (
                      <>
                        <p>Sold: £{car.saleAmount?.toLocaleString() || 0}</p>
                        <p>Sale Year: {car.saleYear || 'N/A'}</p>
                        <p className={`font-bold ${car.profit >= 0? 'text-green-600' : 'text-red-600'}`}>
                          Profit: £{car.profit?.toLocaleString() || 0}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="mt-3">
                    <ActionButtons car={car} />
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand/Model</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colour</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engine/Fuel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th> {/* MOVED HERE */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Year</th> {/* MOVED HERE */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map(car => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{car.registration}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{car.brand} {car.model}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{car.colour}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{car.engine} / {car.fuel}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{car.purchaseYear}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">£{car.totalSpent?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">£{car.saleAmount?.toLocaleString() || 0}</td> {/* MOVED HERE */}
                      <td className="px-4 py-3 text-sm text-gray-700">{car.saleYear || '-'}</td> {/* MOVED HERE */}
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${car.status === 'Sold'? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {car.status}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm font-bold ${car.profit >= 0? 'text-green-600' : 'text-red-600'}`}>
                        £{car.profit?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 text-sm"><ActionButtons car={car} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveCar}
      />

      <SellCarModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSave={handleSellCar}
        car={selectedCar}
      />

      <EditCarModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditCar}
        car={selectedCar}
      />

      {/* DELETE REASON MODAL WITH "OTHER" TEXTBOX */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Delete Car</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Why are you deleting <span className="font-semibold">{carToDelete?.registration}</span>?
              </p>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Sold">Sold</option>
                <option value="Scrapped">Scrapped</option>
                <option value="Personal Use">Personal Use</option>
                <option value="Duplicate Entry">Duplicate Entry</option>
                <option value="Other">Other</option>
              </select>

              {deleteReason === 'Other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Please specify reason..."
                    value={deleteOtherReason}
                    onChange={(e) => setDeleteOtherReason(e.target.value)}
                    maxLength={255}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {deleteOtherReason.length}/255
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCar}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AddCarModal from './AddCarModal'
import SellCarModal from './SellCarModal'
import EditCarModal from './EditCarModal'
import ViewCarModal from './ViewCarModal'

const API_URL = '/api/cars'
const TABS = ['All', 'Held', 'Sold', 'Deleted']

export default function CarTable() {
  const location = useLocation()
  const [cars, setCars] = useState([])
  const [deletedCars, setDeletedCars] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteReason, setDeleteReason] = useState('Sold')
  const [deleteOtherReason, setDeleteOtherReason] = useState('')
  const [carToDelete, setCarToDelete] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)

  useEffect(() => {
    if (location.state?.openAddModal) {
      setIsAddModalOpen(true)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const fetchData = async () => {
    console.log('Fetching cars...')
    setLoading(true)
    try {
      const [activeRes, deletedRes] = await Promise.all([
        fetch(API_URL),
        fetch(`${API_URL}/deleted`)
      ])
      setCars(await activeRes.json())
      setDeletedCars(await deletedRes.json())
    } catch (err) {
      console.error('Failed to fetch cars:', err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleSaveCar = async (newCar) => {
    console.log('Saving new car:', newCar.registration)
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar)
    })
    if(!res.ok) return alert('Failed to save car')
    await fetchData() // PESSIMISTIC: refetch instead of optimistic
    setIsAddModalOpen(false)
  }

  const handleUpdateCar = async (updatedCarData) => {
    console.log('Updating car:', updatedCarData.id)
    const res = await fetch(`${API_URL}/${updatedCarData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCarData)
    })
    if(!res.ok) return alert('Failed to update car')
    await fetchData() // PESSIMISTIC: refetch instead of optimistic

    setIsSellModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedCar(null)
  }

  const handleRestore = async (id) => {
    await fetch(`${API_URL}/${id}/restore`, { method: 'PUT' })
    fetchData() // restore moves between tabs so refetch
  }

  const handlePermanentDelete = async (id) => {
    if (!confirm("Permanently delete? This cannot be undone.")) return
    await fetch(`${API_URL}/${id}/permanent`, { method: 'DELETE' })
    fetchData() // PESSIMISTIC
  }

  const openDeleteModal = (car) => {
    setCarToDelete(car)
    setDeleteReason('Sold')
    setDeleteOtherReason('')
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCar = async () => {
    if (!carToDelete) return
    const finalReason = deleteReason === 'Other'? deleteOtherReason.trim() : deleteReason
    if (deleteReason === 'Other' &&!finalReason) return alert('Please enter a reason for deletion')

    await fetch(`${API_URL}/${carToDelete.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: finalReason })
    })

    await fetchData() // PESSIMISTIC
    setIsDeleteModalOpen(false)
    setCarToDelete(null)
  }

  const openSellModal = (car) => { setSelectedCar(car); setIsSellModalOpen(true) }
  const openEditModal = (car) => { setSelectedCar(car); setIsEditModalOpen(true) }
  const openViewModal = (car) => { setSelectedCar(car); setIsViewModalOpen(true) }

  if (loading) return <div className="p-4">Loading cars...</div>

  const isSold = (car) => car.status?.toLowerCase().trim() === 'sold'

  const filteredCars = () => {
    if (activeTab === 'All') return cars
    if (activeTab === 'Deleted') return deletedCars
    return cars.filter(c => c.status === activeTab)
  }

  const ActionButtons = ({ car }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={() => openViewModal(car)} className="text-gray-600 hover:text-gray-800 font-medium">View</button>
      {activeTab === 'Deleted'? (
        <>
          <button onClick={() => handleRestore(car.id)} className="text-green-600 hover:underline font-medium">Restore</button>
          <button onClick={() => handlePermanentDelete(car.id)} className="text-red-600 hover:underline font-medium">Delete Forever</button>
        </>
      ) : isSold(car)? (
        <button onClick={() => openEditModal(car)} className="text-purple-600 hover:text-purple-800 font-medium">Edit Sale</button>
      ) : (
        <>
          <button onClick={() => openEditModal(car)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
          <button onClick={() => openSellModal(car)} className="text-green-600 hover:text-green-800 font-medium">Sell</button>
        </>
      )}
      {activeTab!== 'Deleted' && <button onClick={() => openDeleteModal(car)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>}
    </div>
  )

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Car Inventory</h2>
          {activeTab!== 'Deleted' && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium">+ Add Car</button>
          )}
        </div>

        <div className="border-b border-gray-200 px-4 sm:px-6">
          <nav className="-mb-px flex space-x-6">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {filteredCars().length === 0? (
          <div className="p-6 text-center text-gray-500">No cars found</div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredCars().map((car) => (
                <div key={car.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{car.registration}</p>
                      <p className="text-sm text-gray-700">{car.make} {car.model}</p>
                      <p className="text-xs text-gray-500">{car.colour} • {car.engine} • {car.fuel}</p>
                      <p className="text-xs text-gray-500">Purchase Year: {car.purchaseYear}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${isSold(car)? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{car.status}</span>
                  </div>
                  <div className="text-sm mt-2 pt-2 border-t space-y-1">
                    <p>Spent: £{car.totalSpent?.toLocaleString() || 0}</p>
                    {isSold(car) && ( // <-- FIX 1: Only show sale info if sold
                      <>
                        <p>Sold: £{car.saleAmount?.toLocaleString() || 0}</p>
                        <p>Sale Year: {car.saleYear || 'N/A'}</p>
                        <p className={`font-bold ${car.profit >= 0? 'text-green-600' : 'text-red-600'}`}>
                          Profit: £{car.profit?.toLocaleString() || 0}
                        </p>
                      </>
                    )}
                    {!isSold(car) && <p className="text-gray-400">Profit: -</p>} {/* <-- FIX 2: Show - if not sold */}
                    {activeTab === 'Deleted' && <p className="text-red-600">Reason: {car.deleted_reason}</p>}
                  </div>
                  <div className="mt-3"><ActionButtons car={car} /></div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">REG</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MAKE/MODEL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">COLOUR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ENGINE/FUEL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PURCHASE YEAR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SPENT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SOLD</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SALE YEAR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STATUS</th>
                    {activeTab === 'Deleted' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DELETED REASON</th>}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PROFIT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCars().map(car => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{car.registration}</td>
                      <td className="px-4 py-3 text-sm">{car.make} {car.model}</td>
                      <td className="px-4 py-3 text-sm">{car.colour}</td>
                      <td className="px-4 py-3 text-sm">{car.engine} / {car.fuel}</td>
                      <td className="px-4 py-3 text-sm">{car.purchaseYear}</td>
                      <td className="px-4 py-3 text-sm">£{car.totalSpent?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 text-sm">{isSold(car)? `£${car.saleAmount?.toLocaleString() || 0}` : '-'}</td> {/* <-- FIX 3 */}
                      <td className="px-4 py-3 text-sm">{isSold(car)? car.saleYear || '-' : '-'}</td> {/* <-- FIX 3 */}
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${isSold(car)? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {car.status}
                        </span>
                      </td>
                      {activeTab === 'Deleted' && <td className="px-4 py-3 text-sm text-red-600">{car.deleted_reason}</td>}
                      <td className={`px-4 py-3 text-sm font-bold ${isSold(car) && car.profit >= 0? 'text-green-600' : isSold(car)? 'text-red-600' : 'text-gray-400'}`}>
                        {isSold(car)? `£${car.profit?.toLocaleString() || 0}` : '-'} {/* <-- FIX 3: Only show profit if sold */}
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

      <AddCarModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveCar} />
      <SellCarModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} onSave={handleUpdateCar} car={selectedCar} />
      <EditCarModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateCar} car={selectedCar} />
      <ViewCarModal isOpen={isViewModalOpen} onClose={() => {setIsViewModalOpen(false); setSelectedCar(null)}} car={selectedCar} />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b"><h3 className="text-lg font-medium">Delete Car</h3></div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Why are you deleting <span className="font-semibold">{carToDelete?.registration}</span>?</p>
              <select value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} className="w-full border-gray-300 rounded-md px-3 py-2">
                <option value="Sold">Sold</option><option value="Scrapped">Scrapped</option><option value="Personal Use">Personal Use</option><option value="Duplicate Entry">Duplicate Entry</option><option value="Other">Other</option>
              </select>
              {deleteReason === 'Other' && <input type="text" placeholder="Please specify reason..." value={deleteOtherReason} onChange={(e) => setDeleteOtherReason(e.target.value)} maxLength={255} className="w-full border-gray-300 rounded-md px-3 py-2 mt-3" />}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
              <button onClick={handleDeleteCar} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
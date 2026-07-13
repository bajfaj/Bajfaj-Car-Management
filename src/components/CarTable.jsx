import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom' // <-- ADD THIS IMPORT
import { cars as initialCars } from '../data/cars'
import AddCarModal from './AddCarModal'
import SellCarModal from './SellCarModal'
import EditCarModal from './EditCarModal'

const STORAGE_KEY = 'bajfaj_cars'

export default function CarTable() {
  const location = useLocation() // <-- ADD THIS LINE
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const isInitialMount = useRef(true)

  // ADD THIS useEffect BLOCK
  useEffect(() => {
    if (location.state?.openAddModal) {
      setIsAddModalOpen(true)
      // Clear state so modal doesn't reopen on page refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    const savedCars = localStorage.getItem(STORAGE_KEY)
    if (savedCars) {
      setCars(JSON.parse(savedCars))
    } else {
      setCars(initialCars)
    }
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
    }
  }, )

  const handleSaveCar = (newCar) => {
    setCars(prev => [...prev, newCar])
  }

  const handleSellCar = (updatedCar) => {
    setCars(prev => prev.map(car => car.id === updatedCar.id? updatedCar : car))
    setSelectedCar(null)
  }

  const handleEditCar = (updatedCar) => {
    setCars(prev => prev.map(car => car.id === updatedCar.id? updatedCar : car))
    setSelectedCar(null)
  }

  const handleDeleteCar = (carId) => {
    if (window.confirm('Are you sure you want to delete this car? This cannot be undone.')) {
      setCars(prev => prev.filter(car => car.id!== carId))
    }
  }

  const openSellModal = (car) => {
    setSelectedCar(car)
    setIsSellModalOpen(true)
  }

  const openEditModal = (car) => {
    setSelectedCar(car)
    setIsEditModalOpen(true)
  }

  const ActionButtons = ({ car }) => (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => openEditModal(car)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
        title="Edit car"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span className="hidden sm:inline">Edit</span>
      </button>
      {car.status === 'Held' && (
        <button 
          onClick={() => openSellModal(car)}
          className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
          title="Mark as sold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h8m-8 3h8m-4-6v9m0 0c-2.5 0-4.5-1.5-4.5-3.5S9.5 10 12 10s4.5 1.5 4.5 3.5S14.5 17 12 17z" />
          </svg>
          <span className="hidden sm:inline">Sell</span>
        </button>
      )}
      <button 
        onClick={() => handleDeleteCar(car.id)}
        className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
        title="Delete car"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="hidden sm:inline">Delete</span>
      </button>
    </div>
  )

  return (
    <>
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
        
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {cars.map((car) => (
            <div key={car.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900">{car.registration}</p>
                  <p className="text-sm text-gray-700">{car.brand} {car.model}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  car.status === 'Sold'? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {car.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Year:</span>
                  <span className="ml-1 text-gray-900">{car.purchaseYear}</span>
                </div>
                <div>
                  <span className="text-gray-500">Color:</span>
                  <span className="ml-1 text-gray-900">{car.colour}</span>
                </div>
                <div>
                  <span className="text-gray-500">Engine:</span>
                  <span className="ml-1 text-gray-900">{car.engine} {car.fuel}</span>
                </div>
                <div>
                  <span className="text-gray-500">Spent:</span>
                  <span className="ml-1 text-gray-900">£{car.totalSpent.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sold:</span>
                  <span className="ml-1 text-gray-900">£{(car.saleAmount || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Profit:</span>
                  <span className={`ml-1 font-medium ${car.profit >= 0? 'text-green-600' : 'text-red-600'}`}>
                    £{car.profit.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <ActionButtons car={car} />
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{car.registration || '-'}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{car.brand}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{car.model}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{car.purchaseYear}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{car.colour}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{car.engine} {car.fuel}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">£{car.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">£{(car.saleAmount || 0).toLocaleString()}</td>
                  <td className={`px-4 py-4 text-sm font-medium ${car.profit >= 0? 'text-green-600' : 'text-red-600'}`}>
                    £{car.profit.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      car.status === 'Sold'? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <ActionButtons car={car} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </>
  )
}
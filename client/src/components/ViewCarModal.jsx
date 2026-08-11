import { useState, useEffect } from 'react'

export default function ViewCarModal({ isOpen, onClose, car }) {
  if (!isOpen || !car) return null
  
  const isSold = car.status?.toLowerCase().trim() === 'sold'
  const formatCurrency = (num) => `£${(Number(num) || 0).toLocaleString()}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl" style={{maxHeight: '90vh', display: 'flex', flexDirection: 'column'}}>
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Car Details</h3>
            <p className="text-sm text-gray-500">{car.registration} - {car.brand} {car.model}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Purchase Info */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-900 border-b pb-2">Purchase Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p><span className="text-gray-500">Brand/Model:</span> <span className="font-medium">{car.brand} {car.model}</span></p>
              <p><span className="text-gray-500">Colour:</span> <span className="font-medium">{car.colour}</span></p>
              <p><span className="text-gray-500">Engine/Fuel:</span> <span className="font-medium">{car.engine} / {car.fuel}</span></p>
              <p><span className="text-gray-500">Transmission:</span> <span className="font-medium">{car.transmission}</span></p>
              <p><span className="text-gray-500">Purchase Year:</span> <span className="font-medium">{car.purchaseYear}</span></p>
              <p><span className="text-gray-500">Source:</span> <span className="font-medium">{car.source}</span></p>
              <p><span className="text-gray-500">Mechanic:</span> <span className="font-medium">{car.mechanic}</span></p>
              <p><span className="text-gray-500">Logbook:</span> <span className="font-medium">{car.logbook}</span></p>
              <p><span className="text-gray-500">Mileage at Purchase:</span> <span className="font-medium">{car.mileagePurchase?.toLocaleString()}</span></p>
              <p><span className="text-gray-500">Personal Use:</span> <span className="font-medium">{car.personalUse}</span></p>
              <p><span className="text-gray-500">Winning Bid:</span> <span className="font-medium">{formatCurrency(car.winningBid)}</span></p>
              <p><span className="text-gray-500">Additional Fee:</span> <span className="font-medium">{formatCurrency(car.additionalFee)}</span></p>
              <p><span className="text-gray-500">Delivery:</span> <span className="font-medium">{formatCurrency(car.delivery)}</span></p>
              <p><span className="text-gray-500">Repair Cost:</span> <span className="font-medium">{formatCurrency(car.repairCost)}</span></p>
              <p className="md:col-span-2 pt-2 border-t font-bold text-base"><span className="text-gray-500">Total Spent:</span> <span>{formatCurrency(car.totalSpent)}</span></p>
            </div>
          </div>

          {/* Sale Info - Only show if sold */}
          {isSold && (
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 border-b pb-2">Sale Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <p><span className="text-gray-500">Sale Amount:</span> <span className="font-medium">{formatCurrency(car.saleAmount)}</span></p>
                <p><span className="text-gray-500">Sale Year:</span> <span className="font-medium">{car.saleYear}</span></p>
                <p><span className="text-gray-500">Platform Sold On:</span> <span className="font-medium">{car.platformSoldOn}</span></p>
                <p><span className="text-gray-500">Advertised On:</span> <span className="font-medium">{car.advertisedOn}</span></p>
                <p><span className="text-gray-500">Advert Duration:</span> <span className="font-medium">{car.advertDuration}</span></p>
                <p><span className="text-gray-500">Mileage at Sale:</span> <span className="font-medium">{car.mileageSale?.toLocaleString()}</span></p>
                <p className="md:col-span-2 pt-2 border-t font-bold text-lg">
                  <span className="text-gray-500">Profit:</span> 
                  <span className={car.profit >= 0? 'text-green-600' : 'text-red-600'}> {formatCurrency(car.profit)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t flex justify-end bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Close</button>
        </div>
      </div>
    </div>
  )
}
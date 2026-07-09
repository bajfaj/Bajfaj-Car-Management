import { cars } from '../data/cars'

export default function CarTable() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Car Inventory</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Add Car
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engine</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{car.brand}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{car.model}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{car.purchaseYear}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{car.colour}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{car.engine} {car.fuel}</td>
                <td className="px-4 py-4 text-sm text-gray-700">£{car.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-700">£{car.saleAmount.toLocaleString()}</td>
                <td className={`px-4 py-4 text-sm font-medium ${car.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  £{car.profit.toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {car.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
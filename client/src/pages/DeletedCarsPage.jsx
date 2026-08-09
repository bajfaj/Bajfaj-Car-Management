import { useEffect, useState } from "react";
import axios from "axios";

export default function DeletedCarsPage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchDeletedCars();
  }, []);

  const fetchDeletedCars = async () => {
    const res = await axios.get("http://localhost:3001/api/cars/deleted");
    setCars(res.data);
  };

  const handleRestore = async (id) => {
    await axios.put(`http://localhost:3001/api/cars/${id}/restore`);
    fetchDeletedCars(); // refresh list
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deleted Cars</h1>
      {cars.length === 0 ? (
        <p>No deleted cars</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Registration</th>
              <th className="border p-2">Make</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">Deleted Reason</th>
              <th className="border p-2">Deleted At</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id}>
                <td className="border p-2">{car.registration}</td>
                <td className="border p-2">{car.make}</td>
                <td className="border p-2">{car.model}</td>
                <td className="border p-2">{car.deleted_reason}</td>
                <td className="border p-2">{car.deleted_at}</td>
                <td className="border p-2">
                  <button 
                    onClick={() => handleRestore(car.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
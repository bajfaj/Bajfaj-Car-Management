import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to Bajfaj</h2>
            <p className="text-gray-600">
              Your car inventory will appear here. Ready to add the Car List table next.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
import { NavLink } from 'react-router-dom'

export default function Sidebar({ onLinkClick }) {
  const linkClass = ({ isActive }) => 
    `block py-2 px-2 rounded transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white font-medium' 
        : 'hover:bg-gray-800 text-gray-300'
    }`

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Bajfaj</h1>
        <button 
          onClick={onLinkClick}
          className="md:hidden text-gray-400 hover:text-white"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav className="space-y-2">
        <NavLink 
          to="/dashboard" 
          onClick={onLinkClick}
          className={linkClass}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/cars" 
          onClick={onLinkClick}
          className={linkClass}
        >
          Cars
        </NavLink>
        <NavLink 
          to="/deleted-cars" 
          onClick={onLinkClick}
          className={linkClass}
        >
          Deleted Cars
        </NavLink>
      </nav>
    </div>
  )
}
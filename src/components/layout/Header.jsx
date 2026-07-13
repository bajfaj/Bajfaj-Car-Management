export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger - only shows on mobile */}
          <button 
            onClick={onMenuClick}
            className="md:hidden text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Car Management Dashboard
          </h1>
        </div>
      </div>
    </header>
  )
}
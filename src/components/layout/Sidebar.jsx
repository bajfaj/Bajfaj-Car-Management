export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '#' },
    { name: 'Cars', href: '#' },
    { name: 'Add Car', href: '#' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-8">Bajfaj</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white"
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  )
}
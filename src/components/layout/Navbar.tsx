import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold whitespace-nowrap" onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Visiomancer
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/products" className="hover:text-gray-300" prefetch={false}>
            Products
          </Link>
          <Link href="/cart" className="hover:text-gray-300">
            Cart
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 p-4">
          <div className="flex flex-col space-y-4">
            <Link href="/products" className="hover:text-gray-300" onClick={toggleMobileMenu} prefetch={false}>
              Products
            </Link>
            <Link href="/cart" className="hover:text-gray-300" onClick={toggleMobileMenu}>
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
} 
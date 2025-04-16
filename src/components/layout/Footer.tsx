export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Visiomancer. All rights reserved.</p>
        {/* Add links to About, Policies, etc. later */}
      </div>
    </footer>
  )
} 
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setDrawerOpen(false) }, [pathname])
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="lg:pl-[264px]">
        <Navbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="px-4 py-7 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

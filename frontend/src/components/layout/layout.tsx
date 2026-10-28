import { Outlet } from 'react-router-dom'
import { TopNav } from './top-nav'

export function Layout() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <TopNav />
      <main className='overflow-y-auto bg-white pt-40 sm:pt-48 lg:p-8'>
        <Outlet />
      </main>
    </div>
  )
}

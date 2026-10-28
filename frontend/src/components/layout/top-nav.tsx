import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ShieldAlert,
  LogOut,
  Menu,
  ChevronDown,
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'Verification Cases', href: '/verification-cases', icon: FileText },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Audit Logs', href: '/audit-logs', icon: HistoryIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
] as const

interface TopNavProps {
  className?: string
}

export function TopNav({ className }: TopNavProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleUserMenuToggle = () => {
    setUserMenuOpen((prev) => !prev)
  }

  return (
    <header
className={cn(
  'top-0 left-0 right-0 z-50 h-16 border-b border-border bg-white',
  className,
)}
    >
      <div className='flex w-full items-center justify-between px-4 sm:px-6 lg:px-8 h-full'>
        {/* LEFT: Logo + Mobile Menu */}
        <div className='flex items-center gap-3 shrink-0'>
          <Button variant='ghost' size='sm' className='lg:hidden'>
            <span className='sr-only'>Open menu</span>
            <Menu className='h-5 w-5' />
          </Button>
          <div className='flex items-center gap-2'>
            <div className='h-7 w-7 rounded-md bg-primary flex items-center justify-center text-white'>
              <ShieldAlert className='h-4 w-4' />
            </div>
            <span className='text-base font-bold tracking-tight text-gray-900 whitespace-nowrap'>
              VeriHire
            </span>
          </div>
        </div>

        {/* CENTER: Navigation Links */}
        <nav className='hidden lg:flex items-center gap-1 shrink-0'>
          {navigation.map((item) => {
            const Icon = item.icon as any
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  'text-gray-600 hover:text-primary hover:bg-primary/50',
                )}
              >
                <Icon className='h-4 w-4' />
                <span>{item.name}</span>
              </a>
            )
          })}
        </nav>

        {/* RIGHT: User Profile Dropdown */}
        <div className='flex items-center gap-2 shrink-0 relative z-20'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleUserMenuToggle}
            className='flex items-center gap-2 px-3 py-2 whitespace-nowrap'
          >
            <span className='hidden sm:block text-sm font-medium text-gray-700'>
              Analyst Demo
            </span>
            <Avatar className='h-8 w-8 rounded-full border border-border/50 bg-primary/10 text-primary'>
              <AvatarFallback className='text-sm font-semibold'>JD</AvatarFallback>
            </Avatar>
            <ChevronDown className='h-4 w-4 text-gray-500 transition-transform duration-200' />
          </Button>

          {userMenuOpen && (
            <div className='absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
              <div className='p-4'>
                <div className='flex flex-col space-y-1.5'>
                  <div className='flex flex-col'>
                    <p className='text-lg font-semibold text-gray-900'>Analyst Demo</p>
                    <p className='text-sm text-gray-500'>verification.analyst@example.com</p>
                  </div>
                </div>
                <Separator className='mx-3 my-3' />
                <div className='px-2 py-1 text-sm text-gray-500'>
                  Verification Analyst
                </div>
                <Separator className='mx-3 my-2' />
                <button
                  onClick={handleUserMenuToggle}
                  className='w-full text-left px-3 py-2 text-sm font-medium text-destructive hover:bg-red-50 rounded-lg transition-colors'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

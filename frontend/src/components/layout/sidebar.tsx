import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea, ScrollAreaContent } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings as SettingsIcon,
  Menu,
  ChevronRight,
  ShieldAlert,
  BarChart3,
} from 'lucide-react'

const HistoryIcon = () => null

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'Verification Cases', href: '/verification-cases', icon: FileText },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Audit Logs', href: '/audit-logs', icon: HistoryIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
] as const

export interface SidebarProps {
  className?: string
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ className, isOpen = true, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 h-screen border-r border-border bg-background transition-transform duration-300',
        isOpen
          ? 'translate-x-0 sm:static sm:inset-0'
          : '-translate-x-full sm:translate-x-0',
        className,
      )}
    >
      <div className='flex h-full flex-col'>
        <div className='flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white'>
              <ShieldAlert className='h-5 w-5' />
            </div>
            <span className='text-lg font-bold tracking-tight text-gray-900'>
              VeriHire
            </span>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onToggle}
            className='md:hidden'
          >
            <span className='sr-only'>Toggle sidebar</span>
            <Menu className='h-5 w-5' />
          </Button>
        </div>

        <ScrollArea className='flex-1 overflow-y-auto sm:border-0'>
          <ScrollAreaContent className='flex flex-col'>
            <div className='flex h-full flex-col px-4 py-6 space-y-4 sm:px-6 lg:px-8'>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-secondary hover:text-primary',
                      'group',
                    )}
                  >
                    <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary-foreground group-hover:text-white'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <span className='text-gray-600 group-hover:text-primary'>
                      {item.name}
                    </span>
                    <ChevronRight className='ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </a>
                )
              })}
            </div>
            <Separator className='mx-4 my-6' />
            <div className='flex flex-col space-y-1 px-4 py-4 sm:px-6 lg:px-8'>
              <a
                href='/settings'
                className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors'
              >
                <SettingsIcon className='h-5 w-5' />
                Settings
              </a>
            </div>
          </ScrollAreaContent>
        </ScrollArea>
      </div>
    </aside>
  )
}

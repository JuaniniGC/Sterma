import { NavLink } from 'react-router'
import type { NavItem } from '@/routes/navigation'

interface SidebarProps {
  items: NavItem[]
  /** Visible en móvil; en escritorio siempre está visible */
  open: boolean
  onClose: () => void
}

const linkBase = 'block rounded-md px-3 py-2 text-sm font-medium transition-colors'
const linkActive = 'bg-slate-800 text-white'
const linkIdle = 'text-slate-300 hover:bg-slate-800 hover:text-white'

export function Sidebar({ items, open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-100 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center px-6 text-lg font-semibold tracking-tight">
          Sterma Admin
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/image', label: 'Image Tools' },
  { to: '/pdf', label: 'PDF Tools' },
  { to: '/pomodoro', label: 'Pomodoro' },
];

function Sidebar({ closeSidebar }) {
  return (
    <aside className="w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 h-full flex flex-col shadow-sm">

      <div className="px-6 py-6 border-b border-gray-100 hidden lg:block">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Edulix
        </h1>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={() => closeSidebar && closeSidebar()}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive
                ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100/50'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <span className="transition-transform group-hover:translate-x-1">
              {link.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-100 lg:block hidden">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          v1.0 · Student Toolkit
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
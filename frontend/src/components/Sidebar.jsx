import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/image', label: 'Image Tools' },
  { to: '/pdf', label: 'PDF Tools' },
  { to: '/pomodoro', label: 'Pomodoro' },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white/80 backdrop-blur border-r border-gray-200 flex flex-col shadow-sm">

      <div className="px-6 py-6 border-b border-gray-100">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Edulix
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <span className="transition-transform group-hover:translate-x-0.5">
              {link.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {/* <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          
        </p>
      </div> */}
    </aside>
  );
}

export default Sidebar;
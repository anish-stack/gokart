import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true, roles: null },
  // { to: '/shipments', label: 'Shipments', roles: null },
  { to: '/services', label: 'Services', roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  // { to: '/products', label: 'Products', roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { to: '/articles', label: 'Articles', roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { to: '/cms', label: 'CMS Pages', roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] },
  { to: '/contact-areas', label: 'Contact Areas', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/contact-submissions', label: 'Contact Submissions', roles: null },
  { to: '/notification-logs', label: 'Notification Logs', roles: null },
  { to: '/config', label: 'App Config', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/users', label: 'Admin Users', roles: ['SUPER_ADMIN'] },
];

export default function Layout() {
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>GO! <span>Track</span> Admin</h1>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
        <div className="navlink logout" onClick={logout} role="button" tabIndex={0}>
          Log out ({user?.name})
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
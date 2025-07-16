import { Link, useLocation } from 'react-router-dom';
import { Home, X, Gamepad2, ListCheck, Award } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: <Home size={18} />, label: 'Home' },
  { to: '/projects', icon: <Gamepad2 size={18} />, label: 'Projects' },
  { to: '/contact', icon: <ListCheck size={18} />, label: 'Contact' },
  { to: '/cv', icon: <Award size={18} />, label: 'CV' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="mt-8 px-4">
      <div className="bg-white border border-gray-200 shadow-md rounded-full flex items-center px-4 py-2 gap-3">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className={clsx(
              'text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all',
              location.pathname === item.to && 'bg-gray-200 text-black'
            )}
          >
            {item.icon}
          </Link>
        ))}

        <Link
          to="/blog"
          className="bg-black text-white px-4 py-1.5 rounded-full ml-3 text-sm font-medium"
        >
          About
        </Link>
      </div>
    </nav>
  );
}

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      path: '/',
      label: 'Aujourd\'hui',
      icon: Home,
    },
    {
      path: '/friends',
      label: 'Mes proches',
      icon: Users,
    },
    {
      path: '/profile',
      label: 'Mon profil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center py-2 px-4 min-w-0 flex-1"
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${
                  active ? 'text-black' : 'text-gray-400'
                }`} 
              />
              <span 
                className={`text-xs font-medium ${
                  active ? 'text-black' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

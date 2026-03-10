import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const Sidebar = ({ menuItems }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSubmenu = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.path}>
            <div className="flex items-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex-1 flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
              {item.submenu && (
                <button
                  onClick={() => toggleSubmenu(item.path)}
                  className="px-2 py-3 text-gray-600 hover:text-gray-900"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${expandedItems[item.path] ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
            
            {item.submenu && expandedItems[item.path] && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
                {item.submenu.map((subitem) => (
                  <NavLink
                    key={subitem.path}
                    to={subitem.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <subitem.icon size={16} />
                    <span>{subitem.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

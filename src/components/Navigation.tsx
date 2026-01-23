import { useState } from 'react';
import { Menu, X, Bell, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin: boolean;
  isClient: boolean;
  notificationCount: number;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, isAdmin, isClient, notificationCount, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = isAdmin 
    ? [
        { id: 'dashboard', label: 'Dashboard' },
      ]
    : isClient
    ? [
        { id: 'home', label: 'Inicio' },
        { id: 'client-portal', label: 'Mis Citas' },
        { id: 'about', label: 'Nosotros' },
        { id: 'services', label: 'Servicios' },
        { id: 'book', label: 'Agendar' },
      ]
    : [
        { id: 'home', label: 'Inicio' },
        { id: 'about', label: 'Nosotros' },
        { id: 'services', label: 'Servicios' },
        { id: 'book', label: 'Agendar' },
      ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate(isAdmin ? 'dashboard' : 'home')}
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="w-8 h-8 bg-[#B8D4A8] rounded-full flex items-center justify-center">
              <span className="text-white">💅</span>
            </div>
            <span className="font-medium text-lg">Nails Maribel</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors ${
                  currentPage === item.id 
                    ? 'text-[#B8D4A8]' 
                    : 'text-gray-600 hover:text-[#B8D4A8]'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {!isAdmin && (
              <button 
                onClick={() => onNavigate('notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            )}

            {!isAdmin && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('login')}
              >
                Acceso Admin
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {!isAdmin && (
              <button 
                onClick={() => onNavigate('notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id 
                    ? 'bg-[#B8D4A8] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {isAdmin ? (
              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Salir
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Acceso Admin
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
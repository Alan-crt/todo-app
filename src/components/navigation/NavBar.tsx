'use client';

import React from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home link */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigation('/')}>
            <span className="text-xl font-bold text-blue-600">Todo App</span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/login')}
            >
              Login
            </Button>
            <Button 
              onClick={() => handleNavigation('/register')}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={() => handleNavigation('/login')}
              >
                Login
              </Button>
              <Button
                className="w-full"
                onClick={() => handleNavigation('/register')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
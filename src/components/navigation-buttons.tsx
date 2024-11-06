'use client';

import { Button } from '@/components/ui/Button';

export const NavigationButtons = () => {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button 
        size="lg" 
        onClick={() => handleNavigation('/login')}
      >
        Get Started
      </Button>
      <Button 
        variant="outline" 
        size="lg" 
        onClick={() => handleNavigation('/register')}
      >
        Create Account
      </Button>
    </div>
  );
};
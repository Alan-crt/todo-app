'use client';
import React from 'react';
import { LockIcon, Users, Layout } from 'lucide-react';
import { Button } from '@/components/ui/Button';


function FeatureCard({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-lg border bg-white shadow-sm">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Create a separate client component for the navigation buttons
const NavigationButtons = () => {
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

// Export the page component as the default export
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Privacy-Focused Todo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A secure, self-hosted task management solution for individuals and small teams.
              Take control of your data while staying organized.
            </p>
            <NavigationButtons />
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              title="Privacy First"
              description="Your data stays under your control with self-hosting capabilities and end-to-end encryption."
              icon={<LockIcon className="w-6 h-6 text-blue-600" />}
            />
            <FeatureCard
              title="Real-time Collaboration"
              description="Work together with your team in real-time while maintaining data privacy."
              icon={<Users className="w-6 h-6 text-blue-600" />}
            />
            <FeatureCard
              title="Simple & Intuitive"
              description="Clean interface focused on productivity without unnecessary complexity."
              icon={<Layout className="w-6 h-6 text-blue-600" />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BusinessSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('x-auth-token');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  const businessSettingsItems = [
    { name: 'Edit Business Profile', path: '/business-settings/profile' },
    { name: 'Logout', onClick: handleLogout },
    // Add other business-specific settings here
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
        <div className="bg-card rounded-lg border">
          {businessSettingsItems.map((item, index) => (
            item.path ? (
              <Link
                to={item.path}
                key={item.name}
                className={`flex items-center justify-between p-4 ${
                  index < businessSettingsItems.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="text-lg">{item.name}</span>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`flex w-full items-center justify-between p-4 ${
                  index < businessSettingsItems.length - 1 ? 'border-b' : ''
                }`}
              >
                <span className="text-lg">{item.name}</span>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;

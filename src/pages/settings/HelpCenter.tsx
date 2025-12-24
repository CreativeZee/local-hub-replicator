import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        <Card>
          <CardContent className="p-0">
            <Link
              to="/settings/help/faq" // Placeholder for FAQ page
              className="flex items-center justify-between p-4 border-b"
            >
              <span className="text-lg">FAQs</span>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
            <Link
              to="/settings/help/contact" // Placeholder for Contact Support page
              className="flex items-center justify-between p-4 border-b"
            >
              <span className="text-lg">Contact Support / Report Issue</span>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
            <Link
              to="/settings/help/troubleshooting" // Placeholder for Troubleshooting page
              className="flex items-center justify-between p-4"
            >
              <span className="text-lg">Troubleshooting</span>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;

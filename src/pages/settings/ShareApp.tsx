import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  WhatsAppLogoIcon,
  FacebookIcon,
  InstagramIcon,
} from '@/components/icons'; // Assuming these icons exist or will be created

const ShareApp = () => {
  const appShareUrl = window.location.origin; // Replace with actual app store link if deployed

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=Check out this amazing app: ${appShareUrl}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${appShareUrl}`, '_blank');
  };

  const shareOnInstagram = () => {
    // Instagram sharing is more complex, usually requires an image and caption
    alert('Instagram sharing typically requires an image and caption. This functionality is a placeholder.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Share This App</h1>
        <Card>
          <CardHeader>
            <CardTitle>Spread the Word!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Help us grow by sharing this app with your friends and family.
            </p>
            <div className="flex flex-col space-y-2">
              <Button onClick={shareOnWhatsApp} className="flex items-center justify-center gap-2">
                {/* <WhatsAppLogoIcon className="h-5 w-5" /> */} {/* Placeholder icon */}
                Share via WhatsApp
              </Button>
              <Button onClick={shareOnFacebook} className="flex items-center justify-center gap-2">
                {/* <FacebookIcon className="h-5 w-5" /> */} {/* Placeholder icon */}
                Share on Facebook
              </Button>
              <Button onClick={shareOnInstagram} className="flex items-center justify-center gap-2">
                {/* <InstagramIcon className="h-5 w-5" /> */} {/* Placeholder icon */}
                Share on Instagram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShareApp;

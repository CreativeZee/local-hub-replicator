import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const PrivacySettings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="profile-public" />
              <Label htmlFor="profile-public">Make my profile public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="post-public" />
              <Label htmlFor="post-public">Make my posts public</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Blocked Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage blocked users here (Not yet implemented)</p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Data Sharing Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Adjust data sharing preferences (Not yet implemented)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySettings;

import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const FeedPreferences = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Feed Preferences</h1>
        <Card>
          <CardHeader>
            <CardTitle>Content Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="content-services" />
              <Label htmlFor="content-services">Services</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="content-posts" />
              <Label htmlFor="content-posts">Posts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="content-questions" />
              <Label htmlFor="content-questions">Questions</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sort By</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="latest" className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="latest" id="sort-latest" />
                <Label htmlFor="sort-latest">Latest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trending" id="sort-trending" />
                <Label htmlFor="sort-trending">Trending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nearby" id="sort-nearby" />
                <Label htmlFor="sort-nearby">Nearby</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Category filtering options (Not yet implemented)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedPreferences;

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input'; // Import Input
import { toast } from '@/components/ui/use-toast'; // Import toast for notifications


const FeedPreferences = () => {
  const [feedPreferences, setFeedPreferences] = useState({
    contentType: 'all',
    sortBy: 'latest',
    filterByCategory: [],
  });
  const [message, setMessage] = useState('');
  const [categoriesInput, setCategoriesInput] = useState(''); // For comma-separated input

  const fetchFeedPreferences = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/me`, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFeedPreferences(data.feedPreferences || feedPreferences);
        setCategoriesInput(data.feedPreferences?.filterByCategory.join(', ') || '');
      } else {
        console.error('Failed to fetch feed preferences:', data.msg);
        toast({ title: 'Error', description: data.msg || 'Failed to fetch feed preferences.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error fetching feed preferences:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while fetching feed preferences.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchFeedPreferences();
  }, []);

export default FeedPreferences;

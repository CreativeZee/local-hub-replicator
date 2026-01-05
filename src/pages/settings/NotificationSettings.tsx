import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; // Import Button
import { toast } from '@/components/ui/use-toast'; // Import toast for notifications

const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: true,
    postNotifications: true,
    groupNotifications: true,
    serviceNotifications: true,
    inviteNotifications: true,
  });
  const [message, setMessage] = useState('');

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/me`, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotificationSettings(data.notificationSettings || notificationSettings);
      } else {
        console.error('Failed to fetch notification settings:', data.msg);
        toast({ title: 'Error', description: data.msg || 'Failed to fetch notification settings.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while fetching notification settings.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

export default NotificationSettings;

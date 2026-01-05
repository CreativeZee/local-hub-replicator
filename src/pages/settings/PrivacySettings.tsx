import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Import RadioGroup components
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input'; // Import Input
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components
import { toast } from '@/components/ui/use-toast'; // Import toast for notifications

const PrivacySettings = () => {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [postVisibility, setPostVisibility] = useState('public');
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [userToBlock, setUserToBlock] = useState('');
  const [message, setMessage] = useState('');
  const [searchUsers, setSearchUsers] = useState<any[]>([]); // State for user search results

  const fetchPrivacySettings = async () => {
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/me', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProfileVisibility(data.profileVisibility || 'public');
        setPostVisibility(data.postVisibility || 'public');
      } else {
        console.error('Failed to fetch privacy settings:', data.msg);
        toast({ title: 'Error', description: data.msg || 'Failed to fetch privacy settings.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while fetching privacy settings.', variant: 'destructive' });
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/blocked-users', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBlockedUsers(data);
      } else {
        console.error('Failed to fetch blocked users:', data.msg);
        toast({ title: 'Error', description: data.msg || 'Failed to fetch blocked users.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while fetching blocked users.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchPrivacySettings();
    fetchBlockedUsers();
  }, []);

  const handleUpdateVisibility = async (setting: 'profileVisibility' | 'postVisibility', value: string) => {
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ [setting]: value }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Success', description: data.msg || 'Visibility updated successfully.' });
        fetchPrivacySettings(); // Re-fetch to ensure UI is in sync
      } else {
        toast({ title: 'Error', description: data.msg || 'Failed to update visibility.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while updating visibility.', variant: 'destructive' });
    }
  };

  const handleBlockUnblockUser = async (targetUserId: string, action: 'block' | 'unblock') => {
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ blockedUserId: targetUserId }), // Backend handles toggle
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Success', description: data.msg });
        fetchBlockedUsers(); // Re-fetch blocked users to update the list
        setUserToBlock(''); // Clear input field
      } else {
        toast({ title: 'Error', description: data.msg || `Failed to ${action} user.`, variant: 'destructive' });
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  const handleSearchUserToBlock = async () => {
    if (!userToBlock) {
      setSearchUsers([]);
      return;
    }
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/users/search?q=${userToBlock}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSearchUsers(data);
      } else {
        toast({ title: 'Error', description: data.msg || 'Failed to search users.', variant: 'destructive' });
        setSearchUsers([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred during user search.', variant: 'destructive' });
      setSearchUsers([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
    </div>
  )
};

export default PrivacySettings;
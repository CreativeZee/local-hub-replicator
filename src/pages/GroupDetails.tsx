import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Edit, Trash } from 'lucide-react';
import CreatePost from '@/components/CreatePost';
import PostList from '@/components/PostList';
import { toast } from '@/components/ui/use-toast';

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [isMember, setIsMember] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const currentUserId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/groups/${groupId}`);
      if (!response.ok) {
        throw new Error('Group not found');
      }
      const data = await response.json();
      setGroup(data);
      setIsMember(data.members.some((member: any) => member.user === currentUserId));
    } catch (error) {
      console.error('Error fetching group details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch group details.',
        variant: 'destructive',
      });
      navigate('/profile'); // Redirect if group not found
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId, currentUserId]);

  const handleJoinLeaveGroup = async (action: 'join' | 'leave') => {
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/groups/${groupId}/${action}`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        toast({
          title: 'Success',
          description: `You have successfully ${action === 'join' ? 'joined' : 'left'} the group.`,
        });
        fetchGroupDetails(); // Refresh group details
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || `Failed to ${action} group`);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing group:`, error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Group successfully deleted.',
        });
        navigate('/profile'); // Redirect after deletion
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to delete group');
      }
    } catch (error: any) {
      console.error('Error deleting group:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-6 max-w-3xl text-center">
          <p>Loading group details...</p>
        </div>
      </div>
    );
  }

  const isCreator = group.user._id === currentUserId;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-5xl">
        <Card className="mb-6">
          <CardHeader className="relative">
            {group.image && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${group.image}`}
                alt={group.name}
                className="rounded-t-lg object-cover h-48 w-full"
              />
            )}
            <div className="p-4">
              <CardTitle className="text-3xl font-bold">{group.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Created by {group.user.name}
              </p>
              <p className="mt-2">{group.description}</p>
              <div className="flex items-center mt-4">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{group.members.length} members</span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {!isCreator && (
                  <Button
                    onClick={() => handleJoinLeaveGroup(isMember ? 'leave' : 'join')}
                    variant={isMember ? 'destructive' : 'default'}
                  >
                    {isMember ? 'Leave Group' : 'Join Group'}
                  </Button>
                )}
                {isCreator && (
                  <>
                    <Button variant="outline" size="icon" onClick={() => navigate(`/groups/${groupId}/edit`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={handleDeleteGroup}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {isMember && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Group Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <CreatePost onPostCreated={() => setRefreshPosts(!refreshPosts)} groupId={groupId} />
              <PostList userId={currentUserId || ''} refreshPosts={refreshPosts} groupId={groupId} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;

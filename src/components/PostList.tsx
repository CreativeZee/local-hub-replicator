import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash, Edit, Heart } from 'lucide-react';
import EditPost from './EditPost';
import { toast } from '@/components/ui/use-toast';

interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  date: string;
}

interface PostListProps {
  userId: string;
  refreshPosts: boolean;
  groupId?: string; // Optional groupId
}

const PostList: React.FC<PostListProps> = ({ userId, refreshPosts, groupId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userFavorites, setUserFavorites] = useState<any[]>([]); // To store current user's favorites

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/profile/me`, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const url = groupId
        ? ``${import.meta.env.VITE_BACKEND_URL}/groups/${groupId}/posts`
        : ``${import.meta.env.VITE_BACKEND_URL}/posts/user/${userId}`;
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchUserFavorites(); // Fetch favorites when component mounts or refresh
  }, [refreshPosts]); // Re-fetch favorites whenever posts are refreshed

  useEffect(() => {
    if (userId || groupId) {
      fetchPosts();
    }
  }, [userId, refreshPosts, groupId]);

  const handleFavoriteToggle = async (postId: string, isFavorited: boolean) => {
    const method = isFavorited ? 'DELETE' : 'POST';
    const url = isFavorited ? ``${import.meta.env.VITE_BACKEND_URL}/profile/favorites/${postId}` : '`${import.meta.env.VITE_BACKEND_URL}/profile/favorites';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: method === 'POST' ? JSON.stringify({ itemId: postId, itemType: 'Post' }) : undefined,
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: isFavorited ? 'Removed from favorites' : 'Added to favorites',
        });
        fetchUserFavorites(); // Refresh favorites status
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.msg || 'Failed to update favorites',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });

      if (response.ok) {
        fetchPosts();
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingPost(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div>
      {posts.map((post) => {
        const isFavorited = userFavorites.some(fav => fav.item._id === post._id && fav.type === 'Post');
        return (
        <Card key={post._id} className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${post.user.avatar}`} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="mb-4">{post.content}</p>
            {post.image && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${post.image}`}
                alt={post.title}
                className="rounded-lg max-h-96 w-full object-cover"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleFavoriteToggle(post._id, isFavorited)}
              className={isFavorited ? 'text-red-500' : ''}
            >
              <Heart className="h-4 w-4" fill={isFavorited ? 'red' : 'none'} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleEditClick(post)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(post._id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      );
})}
       <EditPost
        post={editingPost}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onPostUpdated={() => {
          fetchPosts();
          handleCloseEditDialog();
        }}
      />
    </div>
  );
};

export default PostList;

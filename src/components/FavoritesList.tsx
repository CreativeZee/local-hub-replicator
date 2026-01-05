import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash, HeartCrack } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FavoriteItem {
  item: {
    _id: string;
    name?: string; // For User/Service
    title?: string; // For Post
    description?: string; // For Service
    avatar?: string; // For User
    image?: string; // For Post
    user?: {
      name: string;
      avatar: string;
    }; // For Post
  };
  type: 'Post' | 'User' | 'Recommendation' | 'Service';
}

const FavoritesList: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [refreshFavorites, setRefreshFavorites] = useState(false);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/profile/me`, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        console.error('Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [refreshFavorites]);

  const handleRemoveFavorite = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to remove this from your favorites?')) {
      return;
    }
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/profile/favorites/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });

      if (response.ok) {
        toast({
          title: 'Removed from favorites',
          description: 'The item has been removed from your favorites.',
        });
        setRefreshFavorites(!refreshFavorites);
      } else {
        console.error('Failed to remove from favorites');
        toast({
          title: 'Error',
          description: 'Failed to remove item from favorites.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: 'Error removing item from favorites.',
        variant: 'destructive',
      });
    }
  };

  const renderFavoriteItem = (fav: FavoriteItem) => {
    switch (fav.type) {
      case 'Post':
        return (
          <Card key={fav.item._id} className="mb-4">
            <CardHeader>
              <CardTitle>{fav.item.title}</CardTitle>
              {fav.item.user && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${fav.item.user.avatar}`} />
                    <AvatarFallback>{fav.item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{fav.item.user.name}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p>{fav.item.description || fav.item.content}</p>
              {fav.item.image && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${fav.item.image}`}
                  alt={fav.item.title}
                  className="rounded-lg max-h-48 w-full object-cover mt-2"
                />
              )}
            </CardContent>
            <Button
              variant="destructive"
              size="sm"
              className="m-4"
              onClick={() => handleRemoveFavorite(fav.item._id)}
            >
              <HeartCrack className="h-4 w-4 mr-2" /> Remove
            </Button>
          </Card>
        );
      case 'User': // For favoriting other users/providers
        return (
          <Card key={fav.item._id} className="mb-4">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${fav.item.avatar}`} />
                  <AvatarFallback>{fav.item.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{fav.item.name}</CardTitle>
              </div>
            </CardHeader>
            <Button
              variant="destructive"
              size="sm"
              className="m-4"
              onClick={() => handleRemoveFavorite(fav.item._id)}
            >
              <HeartCrack className="h-4 w-4 mr-2" /> Remove
            </Button>
          </Card>
        );
      case 'Service':
        return (
          <Card key={fav.item._id} className="mb-4">
            <CardHeader>
              <CardTitle>{fav.item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{fav.item.description}</p>
            </CardContent>
            <Button
              variant="destructive"
              size="sm"
              className="m-4"
              onClick={() => handleRemoveFavorite(fav.item._id)}
            >
              <HeartCrack className="h-4 w-4 mr-2" /> Remove
            </Button>
          </Card>
        );
      case 'Recommendation':
        return (
          <Card key={fav.item._id} className="mb-4">
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recommendation details (Not yet implemented)</p>
            </CardContent>
            <Button
              variant="destructive"
              size="sm"
              className="m-4"
              onClick={() => handleRemoveFavorite(fav.item._id)}
            >
              <HeartCrack className="h-4 w-4 mr-2" /> Remove
            </Button>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Favourites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        favorites.map((fav) => renderFavoriteItem(fav))
      )}
    </div>
  );
};

export default FavoritesList;

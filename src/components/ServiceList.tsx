import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Edit, Heart } from 'lucide-react';
import EditService from './EditService';
import { toast } from '@/components/ui/use-toast';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: string;
}

interface ServiceListProps {
  userId: string;
  refreshServices: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({ userId, refreshServices }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
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

  const fetchServices = async () => {
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/services/user/${userId}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchUserFavorites(); // Fetch favorites when component mounts or refresh
  }, [refreshServices]); // Re-fetch favorites whenever services are refreshed

  useEffect(() => {
    if (userId) {
      fetchServices();
    }
  }, [userId, refreshServices]);

  const handleFavoriteToggle = async (serviceId: string, isFavorited: boolean) => {
    const method = isFavorited ? 'DELETE' : 'POST';
    const url = isFavorited ? ``${import.meta.env.VITE_BACKEND_URL}/profile/favorites/${serviceId}` : '`${import.meta.env.VITE_BACKEND_URL}/profile/favorites';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: method === 'POST' ? JSON.stringify({ itemId: serviceId, itemType: 'Service' }) : undefined,
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

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });

      if (response.ok) {
        fetchServices();
      } else {
        console.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingService(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div>
      {services.map((service) => {
        const isFavorited = userFavorites.some(fav => fav.item && fav.item._id === service._id && fav.type === 'Service');
        return (
        <Card key={service._id} className="mb-6">
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{service.category}</p>
            <p className="mb-4">{service.description}</p>
            <p className="font-bold">{service.price}</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleFavoriteToggle(service._id, isFavorited)}
              className={isFavorited ? 'text-red-500' : ''}
            >
              <Heart className="h-4 w-4" fill={isFavorited ? 'red' : 'none'} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleEditClick(service)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(service._id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        );
      })}
      <EditService
        service={editingService}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onServiceUpdated={() => {
          fetchServices();
          handleCloseEditDialog();
        }}
      />
    </div>
  );
};

export default ServiceList;

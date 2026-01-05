import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Service {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: string;
}

interface EditServiceProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onServiceUpdated: () => void;
}

const EditService: React.FC<EditServiceProps> = ({ service, isOpen, onClose, onServiceUpdated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setCategory(service.category);
      setPrice(service.price);
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!service) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/services/${service._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ name, description, category, price }),
      });

      if (response.ok) {
        onServiceUpdated();
        onClose();
      } else {
        console.error('Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Service Name</Label>
            <Input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Input
              type="text"
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-price">Price</Label>
            <Input
              type="text"
              id="edit-price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditService;

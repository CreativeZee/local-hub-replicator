import React, { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface CreateActivityProps {
  onActivityCreated: () => void;
  // businessId is no longer strictly necessary here if the backend determines it from the token
  // but it's good for clarity if we want to associate it explicitly for future potential changes
}

const CreateActivity: React.FC<CreateActivityProps> = ({ onActivityCreated }) => {
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [address, setAddress] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  const [clientFeedback, setClientFeedback] = useState('');
  const [clientId, setClientId] = useState(''); // Assuming client selection will be implemented later
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({
          description,
          serviceType,
          address,
          dateCompleted,
          clientFeedback,
          clientId: clientId || undefined, // Only send if selected
        }),
      });

      if (response.ok) {
        setDescription('');
        setServiceType('');
        setAddress('');
        setDateCompleted('');
        setClientFeedback('');
        setClientId('');
        onActivityCreated();
        setIsOpen(false);
        toast({ title: 'Success', description: 'Activity created successfully.' });
      } else {
        const errorData = await response.json();
        toast({ title: 'Error', description: errorData.msg || 'Failed to create activity', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">Add Activity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Input
              type="text"
              id="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Location Address (Optional)</Label>
            <Input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dateCompleted">Date Completed</Label>
            <Input
              type="date"
              id="dateCompleted"
              value={dateCompleted}
              onChange={(e) => setDateCompleted(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="clientFeedback">Client Feedback (Optional)</Label>
            <Textarea
              id="clientFeedback"
              value={clientFeedback}
              onChange={(e) => setClientFeedback(e.target.value)}
            />
          </div>
          {/* Client selection can be added here */}
          <DialogFooter>
            <Button type="submit">Create Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivity;

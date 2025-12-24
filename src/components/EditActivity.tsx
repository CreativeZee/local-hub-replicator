import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface Activity {
  _id: string;
  business: string;
  client?: {
    _id: string;
    name: string;
    avatar: string;
  };
  description: string;
  serviceType: string;
  location?: {
    address: string;
  };
  dateCompleted: string;
  clientFeedback?: string;
}

interface EditActivityProps {
  activity: Activity;
  onActivityUpdated: () => void;
}

const EditActivity: React.FC<EditActivityProps> = ({ activity, onActivityUpdated }) => {
  const [description, setDescription] = useState(activity.description);
  const [serviceType, setServiceType] = useState(activity.serviceType);
  const [address, setAddress] = useState(activity.location?.address || '');
  const [dateCompleted, setDateCompleted] = useState(
    activity.dateCompleted ? new Date(activity.dateCompleted).toISOString().split('T')[0] : ''
  );
  const [clientFeedback, setClientFeedback] = useState(activity.clientFeedback || '');
  const [clientId, setClientId] = useState(activity.client?._id || ''); // Assuming client selection will be implemented later

  useEffect(() => {
    setDescription(activity.description);
    setServiceType(activity.serviceType);
    setAddress(activity.location?.address || '');
    setDateCompleted(activity.dateCompleted ? new Date(activity.dateCompleted).toISOString().split('T')[0] : '');
    setClientFeedback(activity.clientFeedback || '');
    setClientId(activity.client?._id || '');
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/activities/${activity._id}`, {
        method: 'PUT',
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
          clientId: clientId || undefined,
        }),
      });

      if (response.ok) {
        onActivityUpdated();
        toast({ title: 'Success', description: 'Activity updated successfully.' });
      } else {
        const errorData = await response.json();
        toast({ title: 'Error', description: errorData.msg || 'Failed to update activity', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="edit-serviceType">Service Type</Label>
        <Input
          type="text"
          id="edit-serviceType"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-address">Location Address (Optional)</Label>
        <Input
          type="text"
          id="edit-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="edit-dateCompleted">Date Completed</Label>
        <Input
          type="date"
          id="edit-dateCompleted"
          value={dateCompleted}
          onChange={(e) => setDateCompleted(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="edit-clientFeedback">Client Feedback (Optional)</Label>
        <Textarea
          id="edit-clientFeedback"
          value={clientFeedback}
          onChange={(e) => setClientFeedback(e.target.value)}
        />
      </div>
      {/* Client selection can be added here */}
      <DialogFooter>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
};

export default EditActivity;

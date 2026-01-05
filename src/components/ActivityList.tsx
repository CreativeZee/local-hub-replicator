import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Edit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EditActivity from './EditActivity'; // Assuming this component will be created

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

interface ActivityListProps {
  businessId: string;
  refreshActivities: boolean;
  loggedInUserId: string | null; // Added for conditional rendering of edit/delete
  onActivityEdited: () => void; // Added for refreshing after an edit
}

const ActivityList: React.FC<ActivityListProps> = ({ businessId, refreshActivities, loggedInUserId, onActivityEdited }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentActivityToEdit, setCurrentActivityToEdit] = useState<Activity | null>(null);

  const fetchActivities = async () => {
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/activities/business/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        console.error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchActivities();
    }
  }, [businessId, refreshActivities]);

  const handleDelete = async (activityId: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Activity deleted successfully.' });
        fetchActivities(); // Refresh the list after deletion
      } else {
        const errorData = await response.json();
        toast({ title: 'Error', description: errorData.msg || 'Failed to delete activity', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  const handleEditClick = (activity: Activity) => {
    setCurrentActivityToEdit(activity);
    setIsEditDialogOpen(true);
  };

  const handleActivityUpdate = () => {
    onActivityEdited(); // Trigger refresh in parent
    fetchActivities(); // Also refresh locally
    setIsEditDialogOpen(false); // Close dialog
  };

  return (
    <div>
      {activities.length === 0 ? (
        <p>No activities recorded yet.</p>
      ) : (
        activities.map((activity) => (
          <Card key={activity._id} className="mb-6">
            <CardHeader>
              <CardTitle>{activity.serviceType}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Completed on {new Date(activity.dateCompleted).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p>{activity.description}</p>
              {activity.location?.address && (
                <p className="text-sm text-muted-foreground mt-2">
                  Location: {activity.location.address}
                </p>
              )}
              {activity.client && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${activity.client.avatar}`} />
                    <AvatarFallback>{activity.client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>Client: {activity.client.name}</span>
                </div>
              )}
              {activity.clientFeedback && (
                <p className="mt-2 text-sm italic">
                  "Client Feedback: {activity.clientFeedback}"
                </p>
              )}
            </CardContent>
            {loggedInUserId === activity.business && ( // Conditionally render edit/delete buttons
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEditClick(activity)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(activity._id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        ))
      )}

      {currentActivityToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Activity</DialogTitle>
            </DialogHeader>
            <EditActivity
              activity={currentActivityToEdit}
              onActivityUpdated={handleActivityUpdate}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ActivityList;

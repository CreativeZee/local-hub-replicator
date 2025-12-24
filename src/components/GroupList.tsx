import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Group {
  _id: string;
  name: string;
  description: string;
  image: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  members: Array<{ user: string }>;
}

interface GroupListProps {
  userId: string;
  refreshGroups: boolean;
}

const GroupList: React.FC<GroupListProps> = ({ userId, refreshGroups }) => {
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`/api/groups/user/${userId}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userId, refreshGroups]);

  return (
    <div>
      {groups.length === 0 ? (
        <p>You are not a member of any groups yet.</p>
      ) : (
        groups.map((group) => (
          <Card key={group._id} className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${group.image}`} />
                  <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/groups/${group._id}`}>
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Created by {group.user.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{group.description}</p>
              <p className="text-sm text-muted-foreground">
                {group.members.length} members
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default GroupList;

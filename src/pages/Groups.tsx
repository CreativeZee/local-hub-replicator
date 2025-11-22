import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [yourGroups, setYourGroups] = useState([]);

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.user.id;
    }
    return null;
  };

  const userId = getUserId();
  useEffect(() => {
    const fetchGroups = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchGroups(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fetch all groups if location is not available
            fetchGroups(0, 0);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Fetch all groups if location is not available
        fetchGroups(0, 0);
      }
    };

    getLocation();
  }, []);

  const fetchYourGroups = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/user/${userId}`);
        const data = await response.json();
        setYourGroups(data);
      } catch (error) {
        console.error("Error fetching your groups:", error);
      }
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Handle case where user is not logged in
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        // Optionally, refresh the groups or update the UI
        fetchYourGroups();
        // You might want to switch to the "Your Groups" tab here
      } else {
        // Handle errors, e.g., user already in group
        const data = await response.json();
        console.error("Error joining group:", data.msg);
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Groups</h1>
              </div>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to="/groups/new">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Group
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Groups</TabsTrigger>
                <TabsTrigger value="yours" onClick={fetchYourGroups}>Your Groups</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groups.map((group: any) => (
                    <Card key={group._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={group.image} 
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          <Badge variant="secondary">{group.members.length} members</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleJoinGroup(group._id)}
disabled={
  group.user._id === userId || 
  group.members.some((member: any) => member.user._id?.toString() === userId || member.user.toString() === userId)
}                        >
                          {group.user._id === userId
  ? 'Your Group'
  : group.members.some((member: any) => member.user._id?.toString() === userId || member.user.toString() === userId)
    ? 'Joined'
    : 'Join Group'}

                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="yours">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yourGroups.map((group: any) => (
                    <Card key={group._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={group.image} 
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          <Badge variant="secondary">{group.members.length} members</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleJoinGroup(group._id)}
disabled={
  group.user._id === userId || 
  group.members.some((member: any) => member.user._id?.toString() === userId || member.user.toString() === userId)
}

                        >
                          {group.user === getUserId() ? 'Your Group' : group.members.some((member: any) => member.user === getUserId()) ? 'Joined' : 'Join Group'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Groups;

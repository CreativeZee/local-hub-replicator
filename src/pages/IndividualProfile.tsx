
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Settings, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import CreatePost from "@/components/CreatePost";
import PostList from "@/components/PostList";
import CreateGroup from "@/components/CreateGroup";
import GroupList from "@/components/GroupList";
import FavoritesList from "@/components/FavoritesList";
import { Input } from "@/components/ui/input";

const IndividualProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [refreshGroups, setRefreshGroups] = useState(false);


  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `/api/profile/me`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        }
      );
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1 max-w-8xl">
            <Card className="mb-6">
              <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    aria-label="Edit profile"
                    onClick={() => navigate("/settings/account")} // Link to Account Settings
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    aria-label="Settings"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-0 pb-6">
                <div className="flex items-start gap-4 -mt-10">
                  <Avatar className="h-20 w-20 border-4 border-background bg-muted">
                    <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${user?.avatar}`} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 mt-10">
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user?.location?.address}
                      </p>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">                      
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined{" "}
                        {new Date(user?.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                {user?.bio && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {user.bio}
                  </p>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="posts">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="favorites">My Favourites</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="invite">Invite People</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <CreatePost onPostCreated={() => setRefreshPosts(!refreshPosts)} />
                {user && <PostList userId={user._id} refreshPosts={refreshPosts} />}
              </TabsContent>
              <TabsContent value="favorites">
                <FavoritesList />
              </TabsContent>
              <TabsContent value="groups">
                <CreateGroup onGroupCreated={() => setRefreshGroups(!refreshGroups)} />
                {user && <GroupList userId={user._id} refreshGroups={refreshGroups} />}
              </TabsContent>
              <TabsContent value="invite">
                <h2 className="text-2xl font-bold mb-4">Invite People</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">Invite via Phone Contacts</h3>
                    <p className="text-muted-foreground">
                      Connect with your phone to invite contacts (Not yet implemented).
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Invite via Email</h3>
                    <p className="text-muted-foreground">
                      Send invitations to your friends via email (Not yet implemented).
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Share Invite Link</h3>
                    <p className="text-muted-foreground mb-2">
                      Share this link with anyone you'd like to invite to the app.
                    </p>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            readOnly
                            value={window.location.origin}
                            className="flex-grow"
                        />
                        <Button onClick={() => navigator.clipboard.writeText(window.location.origin)}>Copy Link</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Track Sent Invites</h3>
                    <p className="text-muted-foreground">
                      View the status of your sent invitations (Not yet implemented).
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default IndividualProfile;

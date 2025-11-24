import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, MapPin, Bookmark, Calendar, Heart, Users2, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [interestedEvents, setInterestedEvents] = useState([]);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [introductionOpen, setIntroductionOpen] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
    }
  };
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    address: "",
    avatar: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const response = await fetch("/api/profile/me", {
        
const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`,{       
  headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        });
        const data = await response.json();
        setUser(data);
        setProfileFormData({ name: data.name || "", address: data.location?.address || "", avatar: data.avatar || "", bio: data.bio || "" });
        fetchPosts(data._id);
        fetchGroups(data._id);
        fetchBookmarks();
        fetchInterestedEvents(data._id);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchPosts = async (userId: string) => {
      try {
        // const response = await fetch(`/api/posts/user/${userId}`);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/user/${userId}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchGroups = async (userId: string) => {
      try {
        // const response = await fetch(`/api/groups/user/${userId}`);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/groups/user/${userId}`);
        const data = await response.json();
        debugger;
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    const fetchBookmarks = async () => {
      try {
        // const response = await fetch("/api/profile/bookmarks", {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/bookmarks`, {
        headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        });
        const data = await response.json();
        setBookmarks(data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    const fetchInterestedEvents = async (userId: string) => {
      try {
        // const response = await fetch(`/api/events/attending/${userId}`);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/attending/${userId}`);
        const data = await response.json();
        setInterestedEvents(data);
      } catch (error) {
        console.error("Error fetching interested events:", error);
      }
    };

    fetchProfile();
  }, []);

  const [location, setLocation] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleLocationClick = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          setLocation(data.display_name);
        } catch (error) {
          console.error("Error fetching location:", error);
        } finally {
          setLoadingLocation(false);
        }
      });
    }
  };

  const handleAddInterest = async (interest: string) => {
    try {
      await fetch("/api/profile/interests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ interest }),
      });
      // Refresh user data to show updated interests
      const response = await fetch("/api/profile/me", {
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
      const data = await response.json();
      debugger;
      setUser(data);
    } catch (error) {
      console.error("Error adding interest:", error);
    }
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      formData.append("name", profileFormData.name);
      formData.append("address", profileFormData.address);
      formData.append("bio", profileFormData.bio);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: formData,
      });

      if (response.ok) {
        setEditProfileOpen(false);
        // Refresh profile data
        const updatedUserResponse = await fetch("/api/profile/me", {
          headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        });
        const updatedUserData = await updatedUserResponse.json();
        setUser(updatedUserData);
        setProfileFormData({ name: updatedUserData.name || "", address: updatedUserData.location?.address || "", avatar: updatedUserData.avatar || "", bio: updatedUserData.bio || "" });
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePostIntroduction = async () => {
    console.log("Posting introduction:", introduction);
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ title: "My Introduction", content: introduction }),
      });
      setIntroductionOpen(false);
      setIntroduction("");
      // Refresh posts
      const response = await fetch(`/api/posts/user/${user._id}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error posting introduction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          
          <main className="flex-1 max-w-3xl">
            {/* Cover and Profile Section */}
            <Card className="mb-6">
              <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg relative">
                {loadingLocation && <div className="absolute top-2 left-2 bg-white/50 p-2 rounded-lg">Loading...</div>}
                {location && !loadingLocation && <div className="absolute top-2 left-2 bg-white/50 p-2 rounded-lg">{location}</div>}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full" onClick={handleLocationClick}>
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            value={profileFormData.name}
                            onChange={handleProfileFormChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            type="text"
                            name="address"
                            id="address"
                            value={profileFormData.address}
                            onChange={handleProfileFormChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="avatar">Avatar</Label>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`/api/${user?.avatar}`} />
                              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Input
                              type="file"
                              name="avatar"
                              id="avatar"
                              onChange={handleAvatarChange}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            name="bio"
                            id="bio"
                            value={profileFormData.bio}
                            onChange={handleProfileFormChange}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <CardContent className="pt-0 pb-6">
                <div className="flex items-start gap-4 -mt-10">
                  <Avatar className="h-20 w-20 border-4 border-background bg-muted">
                    <AvatarImage src={`/api/${user?.avatar}`} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 mt-10">
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user?.location?.address}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="default" onClick={() => setEditProfileOpen(true)}>Edit profile</Button>
                      <Button size="sm" variant="outline">Add business page</Button>
                    </div>
                  </div>
                </div>
                {user?.bio && <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p>}
              </CardContent>
            </Card>

            {/* Dashboard Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                  <span className="text-xs text-muted-foreground">Only visible to you</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Profile progress: 0%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0"></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Button variant="outline" size="sm" onClick={() => setIntroductionOpen(true)}>Post your introduction</Button>
                  <Dialog open={introductionOpen} onOpenChange={setIntroductionOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Post Your Introduction</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        placeholder="Tell your neighbors a little about yourself..."
                      />
                      <DialogFooter>
                        <Button onClick={handlePostIntroduction}>Post</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Add Interests</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Interests</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-wrap gap-2">
                        {["Reading", "Traveling", "Cooking", "Sports", "Music", "Movies"].map(interest => (
                          <Button key={interest} variant="outline" onClick={() => handleAddInterest(interest)}>{interest}</Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button variant="ghost" className="flex flex-col items-start h-auto p-4">
                    <Bookmark className="h-5 w-5 mb-2" />
                    <span className="text-sm font-medium">Bookmarks</span>
                    <div className="text-xs text-muted-foreground">{bookmarks.length}</div>
                  </Button>
                  <Button variant="ghost" className="flex flex-col items-start h-auto p-4">
                    <Calendar className="h-5 w-5 mb-2" />
                    <span className="text-sm font-medium">Events</span>
                    <div className="text-xs text-muted-foreground">{interestedEvents.length}</div>
                  </Button>
                  <Button variant="ghost" className="flex flex-col items-start h-auto p-4">
                    <Heart className="h-5 w-5 mb-2" />
                    <span className="text-sm font-medium">Interests</span>
                    <div className="text-xs text-muted-foreground">{user?.interests?.length || 0}</div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Interests Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {user?.interests?.map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => handleAddInterest(interest)}>
                        x
                      </Button>
                    </Badge>
                  ))}
                  <Input
                    placeholder="Add new interest"
                    className="w-48"
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                        await handleAddInterest(e.currentTarget.value.trim());
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Groups Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Groups</h2>
                {groups.length > 0 ? (
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
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-semibold mb-2">No groups yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Crocheting club? Pet sitters? Find a community or start your own!
                    </p>
                    <Button className="bg-primary text-primary-foreground" onClick={() => navigate('/groups')}>
                      <Users2 className="h-4 w-4 mr-2" />
                      Explore groups
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posts Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <PostCard key={post._id} {...post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-semibold mb-2">No posts yet</p>
                    <p className="text-sm text-muted-foreground mb-4">It's quiet here...</p>
                    <Button className="bg-primary text-primary-foreground">
                      <FileText className="h-4 w-4 mr-2" />
                      Create a post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

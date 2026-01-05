
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Settings, Calendar, Edit, MessageSquare } from "lucide-react"; // Import MessageSquare icon
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
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

const IndividualProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params
  const [user, setUser] = useState<any>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null); // State for logged-in user ID
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [refreshGroups, setRefreshGroups] = useState(false);

  const [inviteLink, setInviteLink] = useState(''); // State for generated invite link
  const [inviteEmail, setInviteEmail] = useState(''); // State for invite email input
  const [inviteMessage, setInviteMessage] = useState(''); // State for messages to user

  const fetchProfile = async (profileId: string) => { // Modified to accept profileId
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/user/${profileId}`, // Fetch specific user profile
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
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setLoggedInUserId(decodedToken.user.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const idToFetch = userId || loggedInUserId;
    if (idToFetch) {
        fetchProfile(idToFetch);
    }
  }, [userId, loggedInUserId]);

  const handleMessageClick = () => {
    if (user && user._id) {
      navigate(`/chat/${user._id}`);
    }
  };

  const handleGenerateInviteLink = async () => {
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/invite/generate', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setInviteLink(data.inviteLink);
        setInviteMessage('Invite link generated successfully!');
        navigator.clipboard.writeText(data.inviteLink); // Automatically copy to clipboard
      } else {
        setInviteMessage(data.msg || 'Failed to generate invite link.');
      }
    } catch (error) {
      console.error('Error generating invite link:', error);
      setInviteMessage('An error occurred while generating the invite link.');
    }
  };

  const handleSendEmailInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteEmail) {
      setInviteMessage('Please enter an email address.');
      return;
    }
    try {
      // First, generate an invite link if one isn't already available
      let currentInviteLink = inviteLink;
      if (!currentInviteLink) {
        const generateResponse = await fetch('`${import.meta.env.VITE_BACKEND_URL}/invite/generate', {
          method: 'POST',
          headers: {
            'x-auth-token': localStorage.getItem('token') || '',
          },
        });
        const generateData = await generateResponse.json();
        if (generateResponse.ok) {
          currentInviteLink = generateData.inviteLink;
          setInviteLink(currentInviteLink); // Update state with the newly generated link
        } else {
          setInviteMessage(generateData.msg || 'Failed to generate invite link for email.');
          return;
        }
      }

      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/invite/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ email: inviteEmail, inviteLink: currentInviteLink }),
      });
      const data = await response.json();
      if (response.ok) {
        setInviteMessage(data.msg || 'Invitation email sent!');
        setInviteEmail(''); // Clear email input
      } else {
        setInviteMessage(data.msg || 'Failed to send invitation email.');
      }
    } catch (error) {
      console.error('Error sending email invite:', error);
      setInviteMessage('An error occurred while sending the email invite.');
    }
  };

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
                  {loggedInUserId && user && loggedInUserId === user._id ? (
                    <>
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
                    </>
                  ) : (
                    loggedInUserId && user && ( // Only show message button if not viewing own profile and logged in
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full"
                        aria-label="Message user"
                        onClick={handleMessageClick}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )
                  )}
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
                        {new Date(user?.date).toLocaleDateString("en-US", {
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
                {inviteMessage && (
                  <p className="text-sm text-center text-green-600 mb-4">{inviteMessage}</p>
                )}
                <div className="space-y-6">
                  {/* Generate Invite Link */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Share Invite Link</h3>
                    <p className="text-muted-foreground mb-2">
                      Generate a unique link to invite others.
                    </p>
                    <Button onClick={handleGenerateInviteLink}>Generate Link</Button>
                    {inviteLink && (
                      <div className="flex items-center space-x-2 mt-4">
                        <Input
                          type="text"
                          readOnly
                          value={inviteLink}
                          className="flex-grow"
                        />
                        <Button onClick={() => navigator.clipboard.writeText(inviteLink)}>
                          Copy Link
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Invite via Email */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Invite via Email</h3>
                    <p className="text-muted-foreground mb-2">
                      Send an invitation email to a friend.
                    </p>
                    <form onSubmit={handleSendEmailInvite} className="flex flex-col gap-3">
                      <Input
                        type="email"
                        placeholder="Friend's email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                      <Button type="submit">Send Invitation</Button>
                    </form>
                  </div>

                  {/* Optional: Track Sent Invites - Placeholder */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Track Sent Invites</h3>
                    <p className="text-muted-foreground">
                      (Feature to track sent invitations not yet implemented)
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

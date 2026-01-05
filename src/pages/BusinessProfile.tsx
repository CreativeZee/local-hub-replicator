import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Settings, Globe, Mail, Phone, BadgeCheck, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { jwtDecode } from 'jwt-decode';
import CreatePost from "@/components/CreatePost";
import PostList from "@/components/PostList";
import CreateService from "@/components/CreateService";
import Gallery from "@/components/Gallery";
import ServiceList from "@/components/ServiceList";
import CreateActivity from "@/components/CreateActivity";
import ActivityList from "@/components/ActivityList";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ text: "", rating: 0 });
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [refreshServices, setRefreshServices] = useState(false);
  const [refreshActivities, setRefreshActivities] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/me`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        }
      );
      const data = await response.json();
      setUser(data);
      fetchReviews(data._id);
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
    fetchProfile();
  }, []); // Added token to dependency array

  const fetchReviews = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/reviews/${userId}`
      );
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/reviews/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token") || "",
          },
          body: JSON.stringify(newReview),
        }
      );
      const data = await response.json();
      setReviews([...reviews, data]);
      setNewReview({ text: "", rating: 0 });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleActivityEdited = () => {
    setRefreshActivities(!refreshActivities);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1 max-w-8xl">
            <Card className="mb-6">
              <div
                className="h-48 bg-cover bg-center rounded-t-lg relative"
                style={{
                  backgroundImage: `${user?.coverImage})`,
                }}
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    aria-label="Edit profile"
                    onClick={() => navigate("/business-settings/profile")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    aria-label="Settings"
                    onClick={() => navigate("/business-settings")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-0 pb-6">
                <div className="flex items-start gap-4 -mt-16 ml-6">
                  <Avatar className="h-24 w-24 border-4 border-background bg-muted">
                    <AvatarImage src={`/${user?.avatar}`} />
                    <AvatarFallback className="text-3xl font-semibold">
                      {user?.businessName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 mt-20">
                    <h1 className="text-2xl font-bold flex items-center">
                      {user?.businessName}
                      {user?.isVerified && (
                        <BadgeCheck className="h-6 w-6 ml-2 text-blue-500" />
                      )}
                    </h1>
                    <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user?.location?.address}
                      </p>
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-4 gap-1">                      
                      {user?.phone && (
                        <a
                          href={`tel:${user.phone}`}
                          className="flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          {user.phone}
                        </a>
                      )}
                      {user?.email && (
                        <a
                          href={`mailto:${user.email}`}
                          className="flex items-center gap-1"
                        >
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </a>
                      )}
                      {user?.website && (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Globe className="h-4 w-4" />
                          {user.website}
                        </a>
                      )}
                       {user?.primaryServiceCategory && (
                        <a
                          href={user.primaryServiceCategory}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Globe className="h-4 w-4" />
                          {user.primaryServiceCategory}{","}{user.secondaryServiceCategories}
                        </a>
                      )}
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
                  <p className="mt-4 text-sm text-muted-foreground px-6">
                    {user.bio}
                  </p>
                )}
              </CardContent>
            </Card>
            <Tabs defaultValue="recommendations">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="verify-badge">Verify Badge</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <CreatePost onPostCreated={() => setRefreshPosts(!refreshPosts)} />
                {user && <PostList userId={user._id} refreshPosts={refreshPosts} />}
              </TabsContent>
              <TabsContent value="recommendations">
                <h2 className="text-xl font-semibold mb-4">
                  Recommendations
                </h2>
                <div>
                  {reviews.map((review) => (
                    <div key={review._id} className="mb-4 border-b pb-4">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${review.from.avatar}`} />
                          <AvatarFallback>
                            {review.from.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {review.from.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Rating: {review.rating}/5
                          </p>
                        </div>
                      </div>
                      <p>{review.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleReviewSubmit} className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Leave a Recommendation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        type="number"
                        name="rating"
                        id="rating"
                        value={newReview.rating}
                        onChange={handleReviewChange}
                        min="1"
                        max="5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="text">Review</Label>
                      <Textarea
                        name="text"
                        id="text"
                        value={newReview.text}
                        onChange={handleReviewChange}
                        required
                      />
                    </div>
                    <Button type="submit">Submit Recommendation</Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="services">
                <CreateService onServiceCreated={() => setRefreshServices(!refreshServices)} />
                {user && <ServiceList userId={user._id} refreshServices={refreshServices} />}
              </TabsContent>
              <TabsContent value="availability">
                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{user?.availability}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="gallery">
                {user && <Gallery userId={user._id} initialGallery={user.gallery || []} />}
              </TabsContent>
               <TabsContent value="verify-badge">
                {user?.isVerified ? (
                  <div className="flex flex-col items-center p-6">
                    <BadgeCheck className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold">
                      This provider is verified by AMK Decores.
                    </h3>
                    <p className="text-muted-foreground text-center mt-2">
                      Verification indicates that this service provider is
                      reliable and professional.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-6">
                    <h3 className="text-xl font-semibold">
                      This provider is not verified.
                    </h3>
                    <p className="text-muted-foreground text-center mt-2">
                      Look for the verification badge to ensure you are hiring
                      a trusted professional.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="activity">
                {user && <CreateActivity onActivityCreated={() => setRefreshActivities(!refreshActivities)} />}
                {user && <ActivityList businessId={user._id} refreshActivities={refreshActivities} loggedInUserId={loggedInUserId} onActivityEdited={handleActivityEdited} />}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};
export default BusinessProfile;

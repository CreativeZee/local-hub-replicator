import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { FeedTabs } from "@/components/FeedTabs";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`/api/posts?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchPosts(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fetch all posts if location is not available
            fetchPosts(0, 0);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Fetch all posts if location is not available
        fetchPosts(0, 0);
      }
    };

    getLocation();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          
          <main className="flex-1 max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <FeedTabs />
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="h-4 w-4" />
                Post
              </Button>
            </div>

            <div className="space-y-4">
              {posts.map((post: any) => (
                <PostCard key={post._id} {...post} />
              ))}
            </div>
          </main>

          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Index;

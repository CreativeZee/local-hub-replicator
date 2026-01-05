import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { FeedTabs } from "@/components/FeedTabs";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import CreatePost from "@/components/CreatePost"; // Import CreatePost component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false); // State to manage dialog open/close
  const [refreshPosts, setRefreshPosts] = useState(false); // State to trigger post refresh
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null); // State for logged-in user ID

  const fetchPosts = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getLocationAndFetchPosts = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPosts(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fetch all posts if location is not available or permission denied
          fetchPosts(0, 0); // Default to fetching all posts
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fetch all posts if geolocation is not supported
      fetchPosts(0, 0); // Default to fetching all posts
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
    getLocationAndFetchPosts();
  }, [refreshPosts]); // Re-fetch posts when refreshPosts state changes

  const handlePostCreated = () => {
    setIsCreatePostOpen(false); // Close the dialog
    setRefreshPosts(!refreshPosts); // Trigger a refresh of the posts list
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          
          <main className="flex-1 max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <FeedTabs />
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Plus className="h-4 w-4" />
                    Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                  </DialogHeader>
                  <CreatePost onPostCreated={handlePostCreated} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {posts.map((post: any) => (
                <PostCard key={post._id} {...post} loggedInUserId={loggedInUserId} />
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

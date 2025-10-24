import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { FeedTabs } from "@/components/FeedTabs";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const posts = [
    {
      author: {
        name: "M. N.",
        initials: "M",
        location: "London, England",
        time: "12 hrs ago",
      },
      content: "R.I.P\nJackie Naidoo (age 14) ...",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
      likes: 174,
      comments: 70,
    },
    {
      author: {
        name: "Sarah K.",
        initials: "SK",
        location: "London, England",
        time: "5 hrs ago",
      },
      content: "Does anyone know a good plumber in the area? Need someone reliable for a small job. Thanks in advance!",
      likes: 23,
      comments: 15,
    },
    {
      author: {
        name: "James P.",
        initials: "JP",
        location: "London, England",
        time: "1 day ago",
      },
      content: "Community clean-up this Saturday at 10am! Let's make our neighbourhood shine. All welcome, bring gloves if you have them.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      likes: 89,
      comments: 34,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          
          <main className="flex-1 max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
              <FeedTabs />
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="h-4 w-4" />
                Post
              </Button>
            </div>

            <div className="space-y-4">
              {posts.map((post, index) => (
                <PostCard key={index} {...post} />
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

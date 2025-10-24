import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";

const newsArticles = [
  {
    id: 1,
    title: "Community Garden Project Launches This Spring",
    category: "Community",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    excerpt: "Local residents are coming together to create a shared garden space in the neighbourhood...",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "New Traffic Calming Measures Announced",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    excerpt: "The council has approved new speed bumps and pedestrian crossings for our area...",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Local Business Wins National Award",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556742400-b5a1f8e06751",
    excerpt: "Congratulations to the Corner Café for their outstanding achievement...",
    time: "1 day ago",
  },
];

const LocalNews = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Local News</h1>
            </div>
            
            <div className="space-y-4">
              {newsArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex gap-4">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-48 h-32 object-cover"
                    />
                    <CardContent className="p-4 flex-1">
                      <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                      <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                      <p className="text-xs text-muted-foreground">{article.time}</p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LocalNews;

import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";
import { useState, useEffect } from "react";

const LocalNews = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`http://localhost:5000/api/news?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setNewsArticles(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchNews(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fetch all news if location is not available
            fetchNews(0, 0);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Fetch all news if location is not available
        fetchNews(0, 0);
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
          <main className="flex-1 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Local News</h1>
            </div>
            
            <div className="space-y-4">
              {newsArticles.map((article: any, index: number) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex gap-4">
                    <img 
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-48 h-32 object-cover"
                    />
                    <CardContent className="p-4 flex-1">
                      <Badge variant="secondary" className="mb-2">{article.source.name}</Badge>
                      <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString()}</p>
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

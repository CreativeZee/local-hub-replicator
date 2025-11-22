import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const TreatMap = () => {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchPosts = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts?lat=${latitude}&lon=${longitude}`);
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
            setLocation([position.coords.latitude, position.coords.longitude]);
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
          <main className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Treat Map</h1>
            </div>

            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="h-96 bg-muted flex items-center justify-center">
                  {location ? (
                    <MapContainer center={location} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {posts.map((post: any) => (
                        <Marker key={post._id} position={[post.location.coordinates[1], post.location.coordinates[0]]}>
                          <Popup>
                            {post.content}
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="text-center">
                      <MapPin className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TreatMap;

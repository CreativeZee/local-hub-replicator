import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"; // IMPORTANT FOR VERCEL BUILD

const TreatMap = () => {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState<[number, number] | null>(null);

  // Dynamically loaded components from react-leaflet
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);

  // Load react-leaflet only on client
  useEffect(() => {
    (async () => {
      const leaflet = await import("react-leaflet");
      setLeafletComponents({
        MapContainer: leaflet.MapContainer,
        TileLayer: leaflet.TileLayer,
        Marker: leaflet.Marker,
        Popup: leaflet.Popup,
      });
    })();
  }, []);

  useEffect(() => {
    const fetchPosts = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts?lat=${latitude}&lon=${longitude}`
        );
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
            setLocation([
              position.coords.latitude,
              position.coords.longitude,
            ]);
            fetchPosts(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          () => fetchPosts(0, 0)
        );
      } else {
        fetchPosts(0, 0);
      }
    };

    getLocation();
  }, []);

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents || {};

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

                  {!LeafletComponents || !location ? (
                    <div className="text-center">
                      <MapPin className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  ) : (
                    

// use normally inside client-only component
<MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[51.505, -0.09]}>
    <Popup>A marker</Popup>
  </Marker>
</MapContainer>

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

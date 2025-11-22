import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [yourListings, setYourListings] = useState([]);

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.user.id;
    }
    return null;
  };

  useEffect(() => {
  const fetchListings = async (lat?: number, lon?: number) => {
    let url = "/api/marketplace";
    if (lat && lon) url += `?lat=${lat}&lon=${lon}`;

    const res = await fetch(url);
    const data = await res.json();
    setListings(data);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchListings(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        console.warn("Geolocation denied, showing all listings");
        fetchListings();
      }
    );
  } else {
    fetchListings();
  }
}, []);


  const fetchYourListings = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await fetch(`/api/marketplace/user/${userId}`);
        const data = await response.json();
        setYourListings(data);
      } catch (error) {
        console.error("Error fetching your listings:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All listings</TabsTrigger>
                <TabsTrigger value="yours" onClick={fetchYourListings}>Your Listings</TabsTrigger>
                <TabsTrigger value="saved">Saved listings</TabsTrigger>
              </TabsList>

              <div className="flex gap-2 mb-6 flex-wrap">
                <Button variant="outline" size="sm">Categories: All Categories</Button>
                <Button variant="outline" size="sm">Free</Button>
                <Button variant="outline" size="sm">Distance: 10 km</Button>
                <Button variant="outline" size="sm">Sort by: Most Relevant</Button>
                <Button asChild className="bg-primary text-primary-foreground">
                  <Link to="/marketplace/new">Create Listing</Link>
                </Button>
              </div>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {listings.map((listing: any) => (
                    <Card key={listing._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative aspect-square">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="absolute top-2 right-2 rounded-full h-8 w-8"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm mb-1">{listing.price === 0 ? 'FREE' : `£${listing.price}`}</p>
                        <p className="text-sm mb-2 line-clamp-2">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(listing.date).toLocaleDateString()} · {listing.location?.address}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="yours">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {yourListings.map((listing: any) => (
                    <Card key={listing._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative aspect-square">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="absolute top-2 right-2 rounded-full h-8 w-8"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm mb-1">{listing.price === 0 ? 'FREE' : `£${listing.price}`}</p>
                        <p className="text-sm mb-2 line-clamp-2">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(listing.date).toLocaleDateString()} · {listing.location?.address}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No saved listings yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

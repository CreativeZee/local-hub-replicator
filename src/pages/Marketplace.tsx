import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const sampleListings = [
  { id: 1, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7", price: "£60", title: "Cotswold Oak Nest Of...", time: "10 mins ago", distance: "10.1 km", location: "London" },
  { id: 2, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15", price: "FREE", title: "Baby Shower", time: "6 mins ago", distance: "10.8 km", location: "London" },
  { id: 3, image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e", price: "£150", title: "Take Surveys, Get Paid in London.", time: "Survey Junkie", distance: "", location: "" },
  { id: 4, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6", price: "£150", title: "DeLonghi Espresso ...", time: "6 mins ago", distance: "7.4 km", location: "London" },
  { id: 5, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f", price: "£145 £300", title: "Tile Cutters and wet saws ...", time: "8 mins ago", distance: "9.8 km", location: "London", discount: "£155 off" },
  { id: 6, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62", price: "£60", title: "Mercedes-Benz Car ...", time: "8 mins ago", distance: "10.6 km", location: "London" },
  { id: 7, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6", price: "£60", title: "Large Arched Mirror", time: "10 mins ago", distance: "8.4 km", location: "London" },
  { id: 8, image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a", price: "£8", title: "TCP Vintage Lighting Bulb", time: "10 mins ago", distance: "10.7 km", location: "London" },
];

const Marketplace = () => {
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
                <TabsTrigger value="yours">Your Listings</TabsTrigger>
                <TabsTrigger value="saved">Saved listings</TabsTrigger>
              </TabsList>

              <div className="flex gap-2 mb-6 flex-wrap">
                <Button variant="outline" size="sm">Categories: All Categories</Button>
                <Button variant="outline" size="sm">Free</Button>
                <Button variant="outline" size="sm">Distance: 10 km</Button>
                <Button variant="outline" size="sm">Sort by: Most Relevant</Button>
                <Button variant="outline" size="sm">Discounted</Button>
              </div>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sampleListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
                        {listing.discount && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                            {listing.discount}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm mb-1">{listing.price}</p>
                        <p className="text-sm mb-2 line-clamp-2">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {listing.time} {listing.distance && `· ${listing.distance}`} {listing.location && `· ${listing.location}`}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="yours">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't listed anything yet</p>
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

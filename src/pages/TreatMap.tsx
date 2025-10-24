import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Cake, Coffee, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const treats = [
  {
    id: 1,
    name: "Corner Bakery",
    type: "Bakery",
    address: "123 Main Street",
    distance: "0.3 km",
    icon: Cake,
  },
  {
    id: 2,
    name: "Local Coffee Shop",
    type: "Café",
    address: "45 High Street",
    distance: "0.5 km",
    icon: Coffee,
  },
  {
    id: 3,
    name: "Sweet Treats",
    type: "Dessert",
    address: "78 Park Avenue",
    distance: "0.8 km",
    icon: Gift,
  },
];

const TreatMap = () => {
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
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive map coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {treats.map((treat) => {
                const Icon = treat.icon;
                return (
                  <Card key={treat.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{treat.name}</h3>
                        <p className="text-sm text-muted-foreground">{treat.address}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{treat.type}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{treat.distance}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TreatMap;

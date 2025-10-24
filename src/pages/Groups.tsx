import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const groups = [
  {
    id: 1,
    name: "Local Pet Owners",
    members: 234,
    description: "A group for pet lovers to share tips and arrange playdates",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
  },
  {
    id: 2,
    name: "Gardening Enthusiasts",
    members: 156,
    description: "Share gardening tips, seeds, and celebrate your green thumb",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
  },
  {
    id: 3,
    name: "Parent Meetups",
    members: 189,
    description: "Connect with other parents for support and playdates",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9",
  },
  {
    id: 4,
    name: "Running Club",
    members: 92,
    description: "Join us for weekly runs around the neighbourhood",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
  },
];

const Groups = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Groups</h1>
              </div>
              <Button className="bg-primary text-primary-foreground">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={group.image} 
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      <Badge variant="secondary">{group.members} members</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Groups;

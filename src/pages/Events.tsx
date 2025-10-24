import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    title: "Community BBQ",
    date: "Sat, May 15",
    time: "2:00 PM",
    location: "Central Park",
    attendees: 42,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
  },
  {
    id: 2,
    title: "Neighbourhood Cleanup",
    date: "Sun, May 16",
    time: "10:00 AM",
    location: "Various locations",
    attendees: 28,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
  },
  {
    id: 3,
    title: "Kids Fun Day",
    date: "Sat, May 22",
    time: "11:00 AM",
    location: "Recreation Center",
    attendees: 67,
    image: "https://images.unsplash.com/photo-1514483127413-f72f273478c3",
  },
  {
    id: 4,
    title: "Book Club Meeting",
    date: "Thu, May 20",
    time: "7:00 PM",
    location: "Local Library",
    attendees: 15,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  },
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Events</h1>
              </div>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">{event.date}</Badge>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.attendees} attending
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Interested
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

export default Events;

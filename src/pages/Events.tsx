import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [yourEvents, setYourEvents] = useState([]);

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.user.id;
    }
    return null;
  };

  useEffect(() => {
    const fetchEvents = async (latitude: number, longitude: number) => {
      try {
        // const response = await fetch(`/api/events?lat=${latitude}&lon=${longitude}`);
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchEvents(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fetch all events if location is not available
            fetchEvents(0, 0);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Fetch all events if location is not available
        fetchEvents(0, 0);
      }
    };

    getLocation();
  }, []);

  const fetchYourEvents = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        // const response = await fetch(`/api/events/user/${userId}`);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/user/${userId}`);
        const data = await response.json();
        setYourEvents(data);
      } catch (error) {
        console.error("Error fetching your events:", error);
      }
    }
  };

  const handleInterested = async (eventId: string) => {
    try {
      // await fetch(`/api/events/interested/${eventId}`, {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/events/interested/${eventId}`, {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
    } catch (error) {
      console.error("Error expressing interest:", error);
    }
  };

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
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to="/events/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="yours" onClick={fetchYourEvents}>Your Events</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event: any) => (
                    <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">{new Date(event.date).toLocaleDateString()}</Badge>
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground mb-4">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleTimeString()}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location?.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {event.attendees.length} attending
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleInterested(event._id)}>
                          Interested
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="yours">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yourEvents.map((event: any) => (
                    <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">{new Date(event.date).toLocaleDateString()}</Badge>
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground mb-4">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleTimeString()}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location?.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {event.attendees.length} attending
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleInterested(event._id)}>
                          Interested
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Events;

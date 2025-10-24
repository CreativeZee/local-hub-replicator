import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, MapPin, Bookmark, Calendar, Heart, Users2, FileText } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          
          <main className="flex-1 max-w-3xl">
            {/* Cover and Profile Section */}
            <Card className="mb-6">
              <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-0 pb-6">
                <div className="flex items-start gap-4 -mt-10">
                  <Avatar className="h-20 w-20 border-4 border-background bg-muted">
                    <AvatarFallback className="text-2xl font-semibold">Z</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 mt-10">
                    <h1 className="text-2xl font-bold">Zeeshan R.</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Turpedelown
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="default">Edit profile</Button>
                      <Button size="sm" variant="outline">Add business page</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                  <span className="text-xs text-muted-foreground">Only visible to you</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Profile progress: 0%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0"></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Button variant="outline" size="sm">Add interests</Button>
                  <Button variant="outline" size="sm">Add a profile photo</Button>
                  <Button variant="outline" size="sm">Add a bio</Button>
                  <Button variant="outline" size="sm">Post your introduction</Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button variant="ghost" className="flex flex-col items-start h-auto p-4">
                    <Bookmark className="h-5 w-5 mb-2" />
                    <span className="text-sm font-medium">Bookmarks</span>
                  </Button>
                  <Button variant="ghost" className="flex flex-col items-start h-auto p-4">
                    <Calendar className="h-5 w-5 mb-2" />
                    <span className="text-sm font-medium">Events</span>
                  </Button>
                  <Button variant="ghost" className="flex flex-col items-start h-auto p-4">
                    <Heart className="h-5 w-5 mb-2" />
                    <span className="text-sm font-medium">Interests</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Groups Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Groups</h2>
                <div className="text-center py-8">
                  <Users2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold mb-2">No groups yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crocheting club? Pet sitters? Find a community or start your own!
                  </p>
                  <Button className="bg-primary text-primary-foreground">
                    <Users2 className="h-4 w-4 mr-2" />
                    Explore groups
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold mb-2">No posts yet</p>
                  <p className="text-sm text-muted-foreground mb-4">It's quiet here...</p>
                  <Button className="bg-primary text-primary-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Create a post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;

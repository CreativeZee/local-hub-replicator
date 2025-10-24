import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const RightSidebar = () => {
  return (
    <aside className="w-80 flex-shrink-0">
      <div className="sticky top-20 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div>
                <h3 className="font-semibold">Furzedown</h3>
                <p className="text-sm text-muted-foreground">London</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-between px-0">
              See all alerts
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          <CardContent className="p-0">
            <div className="relative h-48 bg-[url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400')] bg-cover bg-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Invite your neighbours to a street party, meet-up or gathering
                </h3>
                <Button variant="secondary" size="sm" className="mt-2">
                  Create event
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="relative h-40 bg-gradient-to-br from-cyan-400 to-blue-500">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400"
                alt="Business"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Own a local business?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create a business page to connect with neighbours, post updates in the feed, and gain new customers.
              </p>
              <Button variant="ghost" className="w-full justify-between px-0">
                Create page
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};

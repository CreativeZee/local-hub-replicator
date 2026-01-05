import { Home, ShoppingBag, Newspaper, MapPin, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  // { name: "For Sale & Free", href: "/marketplace", icon: ShoppingBag },
  // // { name: "Local News", href: "/news", icon: Newspaper },
  // { name: "Treat Map", href: "/map", icon: MapPin },
  // { name: "Groups", href: "/groups", icon: Users },
  // { name: "Events", href: "/events", icon: Calendar },
];

export const LeftSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-56 flex-shrink-0">
      <nav className="sticky top-20 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  isActive && "bg-accent font-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}

        <div className="pt-4">
          <Link to="/post">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Post
            </Button>
          </Link>
        </div>

        <div className="pt-8 space-y-2 text-sm text-muted-foreground">
          <button className="block hover:underline">Settings</button>
          <button className="block hover:underline">Help centre</button>
          <button className="block hover:underline">Invite neighbours</button>
        </div>
      </nav>
    </aside>
  );
};

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import { Profile } from "./pages/Profile";
import LocalNews from "./pages/LocalNews";
import TreatMap from "./pages/TreatMap";
import Groups from "./pages/Groups";
import Events from "./pages/Events";
import Post from "./pages/Post";
import CreateListing from "./pages/CreateListing";
import CreateEvent from "./pages/CreateEvent";
import CreateGroup from "./pages/CreateGroup";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import "./leaflet-fix";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/news" element={<LocalNews />} />
            <Route path="/map" element={<TreatMap />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/events" element={<Events />} />
            <Route path="/post" element={<Post />} />
            <Route path="/marketplace/new" element={<CreateListing />} />
            <Route path="/events/new" element={<CreateEvent />} />
            <Route path="/groups/new" element={<CreateGroup />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

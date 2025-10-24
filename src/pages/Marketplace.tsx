import { Header } from "@/components/Header";
import { LeftSidebar } from "@/components/LeftSidebar";

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1">
            <h1 className="text-3xl font-bold mb-6">For Sale & Free</h1>
            <p className="text-muted-foreground">Marketplace content coming soon...</p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

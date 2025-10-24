import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FeedTabs = () => {
  return (
    <Tabs defaultValue="foryou" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="foryou"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          For you
        </TabsTrigger>
        <TabsTrigger
          value="recent"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Recent
        </TabsTrigger>
        <TabsTrigger
          value="nearby"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Nearby
        </TabsTrigger>
        <TabsTrigger
          value="trending"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Trending
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

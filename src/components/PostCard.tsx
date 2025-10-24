import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

interface PostCardProps {
  author: {
    name: string;
    initials: string;
    location: string;
    time: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

export const PostCard = ({ author, content, image, likes, comments }: PostCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback className="bg-muted text-foreground">
                {author.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{author.name}</h3>
              <p className="text-sm text-muted-foreground">
                {author.location} · {author.time}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <p className="mb-4 text-foreground">
          {content}
          {content.length > 100 && (
            <button className="text-primary hover:underline ml-1">... see more</button>
          )}
        </p>

        {image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={image} alt="Post" className="w-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-6 text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-2 px-2">
            <Heart className="h-5 w-5" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 px-2">
            <MessageCircle className="h-5 w-5" />
            <span>{comments}</span>
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

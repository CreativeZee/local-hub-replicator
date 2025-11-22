import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from "lucide-react";

interface PostCardProps {
  _id: string;
  title: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  image?: string;
  likes: any[];
  comments: any[];
  date: string;
}

export const PostCard = ({ _id, user, title, content, image, likes, comments, date }: PostCardProps) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const handleLike = async () => {
    try {
      await fetch(`/api/posts/like/${_id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      await fetch(`/api/profile/bookmark/${_id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback className="bg-muted text-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                London, England · {formatTimeAgo(date)}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <h4 className="font-bold text-lg mb-2">{title}</h4>

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
          <Button variant="ghost" size="sm" className="gap-2 px-2" onClick={handleLike}>
            <Heart className="h-5 w-5" />
            <span>{likes.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 px-2">
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Edit,
  Delete,
  Trash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea"; // Assuming Textarea is a UI component
import { Input } from "./ui/input"; // Assuming Input is a UI component

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  date: string;
}

interface PostCardProps {
  _id: string;
  title: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    userType?: "Individual" | "Business";
    businessName?: string;
  };
  content: string;
  image?: string;
  likes: any[]; // Changed from any[] to be more specific if possible
  comments: Comment[];
  date: string;
  loggedInUserId?: string; // Add loggedInUserId
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
}

export const PostCard = ({
  _id,
  user,
  title,
  content,
  image,
  likes,
  comments: initialComments,
  date,
  loggedInUserId,
  location,
}: PostCardProps) => {
  debugger;
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLiked, setIsLiked] = useState(
    loggedInUserId ? likes.some((like) => like.user === loggedInUserId) : false
  );
  const [likeCount, setLikeCount] = useState(likes.length);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    // Re-evaluate isLiked and likeCount if props change (e.g., post is re-fetched)
    setIsLiked(
      loggedInUserId
        ? likes.some((like) => like.user === loggedInUserId)
        : false
    );
    setLikeCount(likes.length);
  }, [likes, loggedInUserId]);

  useEffect(() => {
    // Fetch user's current location once
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location for mentions:", error);
          // Continue without location if permission denied or error
        }
      );
    }
  }, []); // Run once on mount

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm && userLocation) {
        // Only fetch if searchTerm and userLocation are available
        try {
          const response = await fetch(
            ``${import.meta.env.VITE_BACKEND_URL}/users/search?q=${searchTerm}&lat=${userLocation.latitude}&lon=${userLocation.longitude}`
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, userLocation]);

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
    if (!loggedInUserId) return; // User must be logged in to like

    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/posts/like/${_id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        setLikeCount(likeCount + 1);
        setIsLiked(true);
      } else {
        console.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    if (!loggedInUserId) return; // User must be logged in to unlike

    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/posts/unlike/${_id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        setLikeCount(likeCount - 1);
        setIsLiked(false);
      } else {
        console.error("Failed to unlike post");
      }
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      await fetch(``${import.meta.env.VITE_BACKEND_URL}/profile/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ itemId: _id, itemType: "Post" }),
      });
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/posts/comment/${_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ text: newComment }),
      });
      const data = await response.json();
      if (response.ok) {
        setComments(data); // Assuming backend returns updated comments
        setNewComment("");
        setSuggestions([]);
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewComment(value);
    const lastAt = value.lastIndexOf("@");
    debugger;
    if (lastAt !== -1) {
      const term = value.substring(lastAt + 1);
      setSearchTerm(term);
    } else {
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (name: string) => {
    const lastAt = newComment.lastIndexOf("@");
    const newValue = newComment.substring(0, lastAt) + `@${name} `;
    setNewComment(newValue);
    setSearchTerm("");
  };

  function handleDelete(_id: any): void {
    throw new Error("Function not implemented.");
  }

  function handleEditClick(post: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage
                src={`${import.meta.env.VITE_BACKEND_URL}/${user.avatar}`}
              />
              <AvatarFallback className="bg-muted text-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {user.userType === "Business" ? user.businessName : user.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {location?.address} · {formatTimeAgo(date)}
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
            <button className="text-primary hover:underline ml-1">
              ... see more
            </button>
          )}
        </p>

        {image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={image} alt="Post" className="w-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-6 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 px-2"
            onClick={isLiked ? handleUnlike : handleLike}
          >
            <Heart
              className={`h-5 w-5 ${
                isLiked ? "text-red-500 fill-current" : ""
              }`}
            />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 px-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {showComments && (
          <div className="row mt-4">
            {comments.map((comment: any) => (
              <div key={comment._id} className="flex items-start gap-3 mb-4">
                <Avatar>
                  <AvatarImage
                    src={`${import.meta.env.VITE_BACKEND_URL}/${
                      comment.user.avatar
                    }`}
                  />
                  <AvatarFallback className="bg-muted text-foreground">
                    {comment.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{comment.user.name}</h4>
                  <p className="text-sm">{comment.text}</p>
                </div>
                <div className="d-flex justify-content-end ml-auto gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(comment)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(comment._id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                </div>
              </div>
            ))}
            <form
              onSubmit={handleCommentSubmit}
              className="flex gap-3 relative"
            >
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={handleCommentChange}
                className="flex-1"
              />
              <Button type="submit">Post</Button>
              {suggestions.length > 0 && (
                <div className="absolute bottom-12 left-0 w-full bg-white border rounded-md shadow-lg">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleSuggestionClick(suggestion.businessName)
                      }
                    >
                      {suggestion.userType === "Business"
                        ? suggestion.businessName
                        : suggestion.name}
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

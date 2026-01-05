import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreatePostProps {
  onPostCreated: () => void;
  groupId?: string; // Optional groupId
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, groupId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    if (groupId) {
      formData.append('groupId', groupId);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: formData,
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setImage(null);
        onPostCreated();
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create a new post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              type="file"
              id="image"
              onChange={(e) =>
                e.target.files ? setImage(e.target.files[0]) : null
              }
            />
          </div>
          <Button type="submit">Create Post</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;

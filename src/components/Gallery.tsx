import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash } from 'lucide-react';

interface GalleryProps {
  userId: string;
  initialGallery: string[];
}

const Gallery: React.FC<GalleryProps> = ({ userId, initialGallery }) => {
  const [gallery, setGallery] = useState<string[]>(initialGallery);
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    setGallery(initialGallery);
  }, [initialGallery]);

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!images) return;

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('gallery', images[i]);
    }

    try {
      const response = await fetch('/api/profile/gallery', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: formData,
      });

      if (response.ok) {
        const newGallery = await response.json();
        setGallery(newGallery);
        setImages(null);
      } else {
        console.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDeleteImage = async (imagePath: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    try {
      const response = await fetch('/api/profile/gallery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ imagePath }),
      });

      if (response.ok) {
        const newGallery = await response.json();
        setGallery(newGallery);
      } else {
        console.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleImageUpload} className="mb-6 space-y-4">
          <div>
            <label htmlFor="gallery-upload">Upload new images</label>
            <Input
              id="gallery-upload"
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </div>
          <Button type="submit" disabled={!images}>
            Upload
          </Button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((imagePath, index) => (
            <div key={index} className="relative">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${imagePath}`}
                alt={`Gallery image ${index + 1}`}
                className="rounded-lg object-cover h-48 w-full"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => handleDeleteImage(imagePath)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Gallery;

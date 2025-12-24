import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AddBusinessPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    primaryServiceCategory: '',
    secondaryServiceCategories: '',
    website: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append('userType', 'Business');
    for (const key in formData) {
      data.append(key, (formData as any)[key]);
    }
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }
    if (coverImageFile) {
      data.append('coverImage', coverImageFile);
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: data,
      });

      if (response.ok) {
        navigate('/business-profile');
      } else {
        console.error('Failed to convert to business profile');
      }
    } catch (error) {
      console.error('Error converting to business profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="primaryServiceCategory">Primary Service Category</Label>
                <Input
                  type="text"
                  name="primaryServiceCategory"
                  id="primaryServiceCategory"
                  value={formData.primaryServiceCategory}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="secondaryServiceCategories">
                  Secondary Service Categories (comma-separated)
                </Label>
                <Input
                  type="text"
                  name="secondaryServiceCategories"
                  id="secondaryServiceCategories"
                  value={formData.secondaryServiceCategories}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  type="text"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="bio">About Your Business (Bio)</Label>
                <Textarea
                  name="bio"
                  id="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="avatar">Business Logo</Label>
                <Input type="file" name="avatar" id="avatar" onChange={handleAvatarChange} />
              </div>
              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  type="file"
                  name="coverImage"
                  id="coverImage"
                  onChange={handleCoverImageChange}
                />
              </div>
              <Button type="submit">Create Business Profile</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBusinessPage;

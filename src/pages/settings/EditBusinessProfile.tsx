import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EditBusinessProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    address: "",
    avatar: "",
    bio: "",
    businessName: "",
    primaryServiceCategory: "",
    secondaryServiceCategories: "",
    website: "",
    email: "",
    phone: "",
    coverImage: "",
    availability: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `/api/profile/me`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        }
      );
      const data = await response.json();
      setUser(data);
      setProfileFormData({
        name: data.name || "",
        address: data.location?.address || "",
        avatar: data.avatar || "",
        bio: data.bio || "",
        businessName: data.businessName || "",
        primaryServiceCategory: data.primaryServiceCategory || "",
        secondaryServiceCategories:
          data.secondaryServiceCategories?.join(", ") || "",
        website: data.website || "",
        email: data.email || "",
        phone: data.phone || "",
        coverImage: data.coverImage || "",
        availability: data.availability || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
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

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }
      formData.append("name", profileFormData.name);
      formData.append("address", profileFormData.address);
      formData.append("bio", profileFormData.bio);
      formData.append("businessName", profileFormData.businessName);
      formData.append(
        "primaryServiceCategory",
        profileFormData.primaryServiceCategory
      );
      formData.append(
        "secondaryServiceCategories",
        profileFormData.secondaryServiceCategories
      );
      formData.append("website", profileFormData.website);
      formData.append("email", profileFormData.email);
      formData.append("phone", profileFormData.phone);
      formData.append("availability", profileFormData.availability);

      const response = await fetch(
        `/api/profile`,
        {
          method: "PUT",
          headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
          body: formData,
        }
      );

      if (response.ok) {
        fetchProfile();
        navigate('/business-profile'); // Redirect back to business profile after update
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={profileFormData.businessName}
                  onChange={handleProfileFormChange}
                />
              </div>
              <div>
                <Label htmlFor="primaryServiceCategory">
                  Primary Service Category
                </Label>
                <Input
                  type="text"
                  name="primaryServiceCategory"
                  id="primaryServiceCategory"
                  value={profileFormData.primaryServiceCategory}
                  onChange={handleProfileFormChange}
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
                  value={profileFormData.secondaryServiceCategories}
                  onChange={handleProfileFormChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  value={profileFormData.address}
                  onChange={handleProfileFormChange}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  type="text"
                  name="website"
                  id="website"
                  value={profileFormData.website}
                  onChange={handleProfileFormChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={profileFormData.email}
                  onChange={handleProfileFormChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={profileFormData.phone}
                  onChange={handleProfileFormChange}
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  name="availability"
                  id="availability"
                  value={profileFormData.availability}
                  onChange={handleProfileFormChange}
                />
              </div>
              <div>
                <Label htmlFor="avatar">Avatar</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${user?.avatar}`} />
                    <AvatarFallback>
                      {user?.businessName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    name="avatar"
                    id="avatar"
                    onChange={handleAvatarChange}
                  />
                </div>
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
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  name="bio"
                  id="bio"
                  value={profileFormData.bio}
                  onChange={handleProfileFormChange}
                />
              </div>
              <Button type="submit">Save changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditBusinessProfile;

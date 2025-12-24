import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    address: "",
    avatar: "",
    bio: "",
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

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      formData.append("name", profileFormData.name);
      formData.append("address", profileFormData.address);
      formData.append("bio", profileFormData.bio);

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
        navigate('/profile'); // Redirect back to profile after update
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
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={profileFormData.name}
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
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${user?.avatar}`} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
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
      </div>
    </div>
  );
};

export default AccountSettings;

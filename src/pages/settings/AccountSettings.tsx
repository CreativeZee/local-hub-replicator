import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card"; // Import Card component for structure
import { toast } from '@/components/ui/use-toast'; // Import toast for notifications


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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");


  const fetchProfile = async () => {
    try {
      const response = await fetch(
        ``${import.meta.env.VITE_BACKEND_URL}/profile/me`,
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
      setNewEmail(data.email || ""); // Set initial email
      setNewPhone(data.phone || ""); // Set initial phone
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
        ``${import.meta.env.VITE_BACKEND_URL}/profile`,
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
        toast({ title: "Success", description: "Profile updated successfully." });
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.msg || "Failed to update profile", variant: "destructive" });
        console.error("Failed to update profile");
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage("New passwords do not match.");
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordChangeMessage(data.msg);
        toast({ title: "Success", description: data.msg });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordChangeMessage(data.msg || "Failed to change password.");
        toast({ title: "Error", description: data.msg || "Failed to change password.", variant: "destructive" });
      }
    } catch (error) {
      setPasswordChangeMessage("An error occurred while changing password.");
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
      console.error("Error changing password:", error);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ newEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmailMessage(data.msg);
        toast({ title: "Success", description: data.msg });
        fetchProfile(); // Refresh profile to show updated email
      } else {
        setEmailMessage(data.msg || "Failed to update email.");
        toast({ title: "Error", description: data.msg || "Failed to update email.", variant: "destructive" });
      }
    } catch (error) {
      setEmailMessage("An error occurred while updating email.");
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
      console.error("Error updating email:", error);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/phone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ newPhone }),
      });

      const data = await response.json();
      if (response.ok) {
        setPhoneMessage(data.msg);
        toast({ title: "Success", description: data.msg });
        fetchProfile(); // Refresh profile to show updated phone
      } else {
        setPhoneMessage(data.msg || "Failed to update phone number.");
        toast({ title: "Error", description: data.msg || "Failed to update phone number.", variant: "destructive" });
      }
    } catch (error) {
      setPhoneMessage("An error occurred while updating phone number.");
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
      console.error("Error updating phone:", error);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {/* Profile Update Form */}
        <Card className="mb-6 p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
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
            <Button type="submit">Save Profile Changes</Button>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="mb-6 p-6">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                type="password"
                name="confirmNewPassword"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Change Password</Button>
            {passwordChangeMessage && (
              <p className="text-sm mt-2">{passwordChangeMessage}</p>
            )}
          </form>
        </Card>

        {/* Manage Email Form */}
        <Card className="mb-6 p-6">
          <h2 className="text-2xl font-semibold mb-4">Manage Email</h2>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newEmail">Current Email: {user?.email}</Label>
              <Input
                type="email"
                name="newEmail"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Update Email</Button>
            {emailMessage && (
              <p className="text-sm mt-2">{emailMessage}</p>
            )}
          </form>
        </Card>

        {/* Manage Phone Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Manage Phone</h2>
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPhone">Current Phone: {user?.phone || 'N/A'}</Label>
              <Input
                type="tel"
                name="newPhone"
                id="newPhone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Update Phone</Button>
            {phoneMessage && (
              <p className="text-sm mt-2">{phoneMessage}</p>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

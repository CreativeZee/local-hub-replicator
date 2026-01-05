import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, FileText } from "lucide-react"; // Import new icons

const EditBusinessProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [newCertificateFiles, setNewCertificateFiles] = useState<File[]>([]); // New state for selected certificate files
  const [certificates, setCertificates] = useState<string[]>([]); // New state for uploaded certificates
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
      setCertificates(data.diplomasAndCertificates || []); // Populate certificates state
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

  const handleCertificateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewCertificateFiles(Array.from(e.target.files));
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
        // Upload new certificates if any
        if (newCertificateFiles.length > 0) {
          const certificateFormData = new FormData();
          newCertificateFiles.forEach((file) => {
            certificateFormData.append("certificates", file);
          });

          const certUploadResponse = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/certificates', {
            method: 'POST',
            headers: {
              'x-auth-token': localStorage.getItem('token') || '',
            },
            body: certificateFormData,
          });

          if (!certUploadResponse.ok) {
            console.error("Failed to upload certificates");
            // Still proceed with fetching profile even if certificate upload fails
          }
        }

        fetchProfile();
        navigate('/profile'); // Redirect back to business profile after update
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteCertificate = async (filePath: string) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) {
      return;
    }
    try {
      const response = await fetch('`${import.meta.env.VITE_BACKEND_URL}/profile/certificates', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '',
        },
        body: JSON.stringify({ filePath }),
      });

      if (response.ok) {
        // Update the certificates state locally to reflect the deletion
        setCertificates(certificates.filter(cert => cert !== filePath));
        console.log("Certificate deleted successfully.");
      } else {
        console.error("Failed to delete certificate.");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
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

              {/* Diplomas & Certificates Upload */}
              <div>
                <Label htmlFor="certificates">Diplomas & Certificates</Label>
                <Input
                  type="file"
                  name="certificates"
                  id="certificates"
                  multiple
                  onChange={handleCertificateFileChange}
                />
              </div>

              {/* Display Existing Certificates */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Uploaded Certificates</h3>
                {certificates.length === 0 ? (
                  <p className="text-muted-foreground">No diplomas or certificates uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((certPath) => (
                      <Card key={certPath} className="flex items-center justify-between p-3">
                        <a
                          href={`${import.meta.env.VITE_BACKEND_URL}/${certPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <FileText className="h-5 w-5" />
                          {certPath.split('/').pop()} {/* Display filename */}
                        </a>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteCertificate(certPath)} // To be implemented
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
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

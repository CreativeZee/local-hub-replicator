
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });
  const navigate = useNavigate();
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }
}, []);
  const { title, description, price, image } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:5000/api/marketplace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(formData), // includes lat/lon
    });

    const data = await response.json();
    if (response.ok) {
      navigate("/marketplace");
    } else {
      console.error("Failed to create listing", data);
    }
  } catch (error) {
    console.error("Error creating listing:", error);
  }
};



  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Create Listing</h1>
      <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            name="description"
            id="description"
            value={description}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            name="price"
            id="price"
            value={price}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="text"
            name="image"
            id="image"
            value={image}
            onChange={onChange}
          />
        </div>
        <Button type="submit">Create Listing</Button>
      </form>
    </div>
  );
};

export default CreateListing;

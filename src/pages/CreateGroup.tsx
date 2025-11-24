
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const navigate = useNavigate();

  const { name, description, image } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const response = await fetch("/api/groups", {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/groups");
      } else {
        console.error("Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Create Group</h1>
      <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={name}
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
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="text"
            name="image"
            id="image"
            value={image}
            onChange={onChange}
          />
        </div>
        <Button type="submit">Create Group</Button>
      </form>
    </div>
  );
};

export default CreateGroup;

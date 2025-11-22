
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
  });
  const navigate = useNavigate();

  const { title, description, date, image } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/events");
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
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
          <Label htmlFor="date">Date</Label>
          <Input
            type="datetime-local"
            name="date"
            id="date"
            value={date}
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
        <Button type="submit">Create Event</Button>
      </form>
    </div>
  );
};

export default CreateEvent;

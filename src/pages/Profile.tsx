import { useState, useEffect } from "react";
import IndividualProfile from "./IndividualProfile";
import BusinessProfile from "./BusinessProfile";
import { jwtDecode } from "jwt-decode";


export const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setLoggedInUserId(decodedToken.user.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/me`, {
          headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading profile.</div>;
  }

  if (user.userType === "Business") {
    return <BusinessProfile />;
  }

  return <IndividualProfile />;
};
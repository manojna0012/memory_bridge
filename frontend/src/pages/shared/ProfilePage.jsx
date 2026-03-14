import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import { useAuth } from "../../auth/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!user?.name) return;

    // Convert name to match backend filenames
    const safeName = user.name.toLowerCase().replace(/\s+/g, "_");

    // Try to find the first existing photo (_1.jpg, _2.jpg, ...)
    const loadPhoto = async () => {
      for (let i = 1; i <= 5; i++) {
        const url = `http://localhost:5000/faces/${safeName}_${i}.jpg`;
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) {
            setPhotoUrl(url);
            return;
          }
        } catch (err) {
          console.log("Photo check error:", err);
        }
      }
      // No photo found
      setPhotoUrl(null);
    };

    loadPhoto();
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Profile" subtitle="Your account" />

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-soft p-6 text-center">

          {/* Profile Photo */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="profile"
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 border-primary"
            />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-teal-light flex items-center justify-center text-primary text-2xl font-bold mb-4">
              {user?.name?.[0] ?? "?"}
            </div>
          )}

          {/* Name */}
          <h2 className="font-heading text-lg font-bold mb-1">
            {user?.name ?? "Anonymous"}
          </h2>

          {/* Email */}
          <p className="text-sm text-muted-foreground mb-4">
            {user?.email ?? "No email"}
          </p>

          {/* Role */}
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Role
          </div>
          <p className="font-medium capitalize">
            {user?.role ?? "Unknown"}
          </p>

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
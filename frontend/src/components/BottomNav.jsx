import { NavLink } from "react-router-dom";
import { Home, Users, Bell, Clock } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const BottomNav = () => {

  const { user } = useAuth();

  const caregiverLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/people", icon: Users, label: "People" },
    { to: "/reminders", icon: Bell, label: "Reminders" },
    { to: "/memories", icon: Clock, label: "Memories" },
  ];

  const patientLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/recognize", icon: Users, label: "Recognize" },
    { to: "/reminders", icon: Bell, label: "Reminders" },
    { to: "/memories", icon: Clock, label: "Memories" },
  ];

  const links = user.role === "caregiver" ? caregiverLinks : patientLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">

        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className="flex flex-col items-center text-xs text-muted-foreground"
          >
            <l.icon className="w-5 h-5" />
            {l.label}
          </NavLink>
        ))}

      </div>
    </nav>
  );
};

export default BottomNav;
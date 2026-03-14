import { Brain, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AppHeader = ({ title, subtitle }) => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open,setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (

    <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">

      <div className="flex items-center justify-between max-w-lg mx-auto">

        {/* Logo */}

        <div className="flex items-center gap-2">

          <Brain className="w-6 h-6 text-primary"/>

          <div>
            <h1 className="font-heading font-bold text-lg">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

        </div>

        {/* Profile */}

        <div className="relative">

          <button
            onClick={()=>setOpen(!open)}
            className="bg-muted p-2 rounded-full"
          >
            <User size={18}/>
          </button>

          {open && (

            <div className="absolute right-0 mt-2 bg-card border border-border rounded-xl shadow-soft w-40">

              <button
                onClick={()=>navigate("/profile")}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
              >
                <User size={16}/> Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-muted"
              >
                <LogOut size={16}/> Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );
};

export default AppHeader;
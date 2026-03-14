import { useNavigate } from "react-router-dom";
import { Users, Bell, Clock } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";

const actions = [
  {
    title: "People",
    subtitle: "Manage family & friends",
    icon: Users,
    path: "/people",
    color: "bg-teal-light text-primary"
  },
  {
    title: "Reminders",
    subtitle: "Add daily notifications",
    icon: Bell,
    path: "/reminders",
    color: "bg-warm-peach text-secondary"
  },
  {
    title: "Memories",
    subtitle: "Save meaningful moments",
    icon: Clock,
    path: "/memories",
    color: "bg-amber-light-custom text-foreground"
  }
];

const CaregiverDashboard = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="Caregiver"
        subtitle="Manage patient information"
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Greeting Card */}

        <div className="bg-card rounded-2xl p-5 shadow-soft">

          <h2 className="font-heading text-lg font-bold mb-1">
            Welcome back 👋
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage patient memories, reminders and people easily.
          </p>

        </div>

        {/* Action Cards */}

        <div className="space-y-3">

  {actions.map((a)=>(
    <button
      key={a.title}
      onClick={()=>navigate(a.path)}
      className="w-full bg-primary text-white rounded-xl p-4 shadow-soft flex items-center gap-4 hover:opacity-90 transition"
    >

      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20">
        <a.icon size={20}/>
      </div>

      <div className="text-left">

        <p className="font-medium text-sm">
          {a.title}
        </p>

        <p className="text-xs text-white/80">
          {a.subtitle}
        </p>

      </div>

    </button>
  ))}

</div>

      </main>

      <BottomNav/>

    </div>
  );
};

export default CaregiverDashboard;
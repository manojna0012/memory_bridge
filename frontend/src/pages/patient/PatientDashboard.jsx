import { useNavigate } from "react-router-dom";
import { Bell, Clock, Users } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import FloatingAI from "../../components/FloatingAI";

import { useLocalStorage } from "../../hooks/useLocalStorage";

const PatientDashboard = () => {

  const navigate = useNavigate();

  const [reminders] = useLocalStorage("memorybridge_reminders", []);
  const [memories] = useLocalStorage("memorybridge_memories", []);
  const [people] = useLocalStorage("memorybridge_people", []);

  return (
    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="MemoryBridge"
        subtitle="Your cognitive companion"
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">

        <div className="bg-card rounded-2xl p-6 shadow-soft">

          <h2 className="text-lg font-heading font-bold mb-2">
            Welcome back 👋
          </h2>

          <p className="text-muted-foreground text-sm">
            You have {reminders.length} reminders today.
          </p>

        </div>

        <div className="grid grid-cols-3 gap-3">

          <button
            onClick={()=>navigate("/recognize")}
            className="bg-primary text-white rounded-xl p-4 shadow-soft flex flex-col items-center"
          >
            <Users size={18}/>
            <span className="text-xs mt-2">Recognize</span>
          </button>

          <button
            onClick={()=>navigate("/reminders")}
            className="bg-primary text-white rounded-xl p-4 shadow-soft flex flex-col items-center"
          >
            <Bell size={18}/>
            <span className="text-xs mt-2">Reminders</span>
          </button>

          <button
            onClick={()=>navigate("/memories")}
            className="bg-primary text-white rounded-xl p-4 shadow-soft flex flex-col items-center"
          >
            <Clock size={18}/>
            <span className="text-xs mt-2">Memories</span>
          </button>

        </div>

      </main>

      <FloatingAI/>

      <BottomNav/>

    </div>
  );
};

export default PatientDashboard;
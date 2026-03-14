import { Bell } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import FloatingAI from "../../components/FloatingAI";

import { useLocalStorage } from "../../hooks/useLocalStorage";

const ViewReminders = () => {

  const [reminders] =
    useLocalStorage("memorybridge_reminders",[]);

  return (

    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="Reminders"
        subtitle="Your daily schedule"
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {reminders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No reminders available
          </div>
        )}

        {reminders.map((r)=>(
          <div
            key={r.id}
            className="bg-card rounded-2xl shadow-soft p-4 flex items-center gap-4"
          >

            <div className="bg-teal-light p-3 rounded-xl">
              <Bell size={18}/>
            </div>

            <div className="flex-1">

              <p className="font-medium text-sm">
                {r.title}
              </p>

              <p className="text-xs text-muted-foreground">
                {r.time}
              </p>

              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                {r.type}
              </span>

            </div>

          </div>
        ))}

      </main>

      <FloatingAI/>
      <BottomNav/>

    </div>
  );
};

export default ViewReminders;
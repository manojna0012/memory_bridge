import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import FloatingAI from "../../components/FloatingAI";

import { useLocalStorage } from "../../hooks/useLocalStorage";

const ViewReminders = () => {

  const [reminders] =
    useLocalStorage("memorybridge_reminders",[]);

  const [activeReminder,setActiveReminder] = useState(null);

  const triggeredReminders = useRef(new Set());

  // Ask notification permission
  useEffect(() => {

    if ("Notification" in window) {
      Notification.requestPermission();
    }

  }, []);

  // Check reminders every 30 seconds
  useEffect(() => {

    const checkReminders = () => {

      const now = new Date();

      const currentTime =
        now.getHours().toString().padStart(2,"0") +
        ":" +
        now.getMinutes().toString().padStart(2,"0");

      reminders.forEach((r) => {

        if (
          r.time === currentTime &&
          !triggeredReminders.current.has(r.id)
        ) {

          triggeredReminders.current.add(r.id);

          showNotification(r);

          setActiveReminder(r);

        }

      });

    };

    const interval = setInterval(checkReminders,30000);

    checkReminders();

    return () => clearInterval(interval);

  },[reminders]);

  const showNotification = (reminder) => {

    if(Notification.permission === "granted"){

      new Notification("Reminder",{
        body: `${reminder.title} • ${reminder.type}`
      });

    }

  };

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

{/* Reminder Popup */}

{activeReminder && (
  <div className="fixed bottom-24 left-[48%] -translate-x-1/2 z-50 w-[40%] max-w-sm">

    <div className="bg-primary text-white border border-border shadow-card rounded-xl px-3 py-2.5 flex items-center gap-3">

      {/* Icon */}
      <div className="flex items-center justify-center bg-primary text-white p-2 rounded-lg shrink-0">
        <Bell size={18} />
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col leading-tight">

        <p className="font-heading font-semibold text-xs text-white">
          {activeReminder.title}
        </p>

        <p className="text-[10px] text-muted-foreground">
          {activeReminder.time}
        </p>

        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-0.5 w-fit capitalize">
          {activeReminder.type}
        </span>

      </div>

      {/* Close */}
      <button
        onClick={() => setActiveReminder(null)}
        className="text-[10px] text-muted-foreground hover:text-primary whitespace-nowrap"
      >
        Done
      </button>

    </div>
  </div>
)}

      <FloatingAI/>
      <BottomNav/>

    </div>
  );
};

export default ViewReminders; 
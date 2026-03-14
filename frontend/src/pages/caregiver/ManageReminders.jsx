import { useState } from "react";
import { Plus, Bell, Trash2 } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const ManageReminders = () => {

  const [reminders,setReminders] =
    useLocalStorage("memorybridge_reminders",[]);

  const [title,setTitle] = useState("");
  const [time,setTime] = useState("");
  const [type,setType] = useState("routine");

  const addReminder = ()=>{

    if(!title || !time) return;

    const r = {
      id: crypto.randomUUID(),
      title,
      time,
      type
    };

    setReminders([...reminders,r]);

    setTitle("");
    setTime("");
    setType("routine");
  };

  const removeReminder=(id)=>{
    setReminders(reminders.filter(r=>r.id!==id));
  };

  return(

    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="Reminders"
        subtitle="Create notifications"
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Add Reminder */}

        <div className="bg-card p-4 rounded-2xl shadow-soft space-y-3">

          <input
            placeholder="Reminder title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="border border-border px-3 py-2 rounded-md w-full text-sm"
          />

          <div className="flex gap-2">

            <input
              type="time"
              value={time}
              onChange={(e)=>setTime(e.target.value)}
              className="border border-border px-3 py-2 rounded-md flex-1 text-sm"
            />

            <select
              value={type}
              onChange={(e)=>setType(e.target.value)}
              className="border border-border px-3 py-2 rounded-md text-sm"
            >
              <option value="routine">Routine</option>
              <option value="medication">Medication</option>
              <option value="meal">Meal</option>
              <option value="appointment">Appointment</option>
              <option value="other">Other</option>
            </select>

          </div>

          <button
            onClick={addReminder}
            className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
          >
            <Plus size={16}/> Add Reminder
          </button>

        </div>

        {/* Reminders List */}

        {reminders.map((r)=>(
          <div
            key={r.id}
            className="bg-card p-4 rounded-xl shadow-soft flex justify-between items-center"
          >

            <div>

              <p className="text-sm font-medium">
                {r.title}
              </p>

              <p className="text-xs text-muted-foreground">
                {r.time}
              </p>

              <span className="text-[10px] bg-teal-light text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                {r.type}
              </span>

            </div>

            <button onClick={()=>removeReminder(r.id)}>
              <Trash2 size={16} className="text-red-500"/>
            </button>

          </div>
        ))}

      </main>

      <BottomNav/>

    </div>
  );
};

export default ManageReminders;
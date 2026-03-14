import { useState } from "react";
import { Clock, Search } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import FloatingAI from "../../components/FloatingAI";

import { useLocalStorage } from "../../hooks/useLocalStorage";

const ViewMemories = () => {

  const [memories] = useLocalStorage("memorybridge_memories",[]);
  const [query,setQuery] = useState("");
  const [searchType,setSearchType] = useState("text");

  const filtered = memories.filter((m)=>{

    if(!query) return true;

    if(searchType === "text"){
      return (
        m.title?.toLowerCase().includes(query.toLowerCase()) ||
        m.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if(searchType === "date"){
      return m.date?.includes(query);
    }

    return true;

  });

  return (

    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="Memories"
        subtitle="Important moments"
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* SEARCH CARD */}

        <div className="bg-card rounded-2xl shadow-soft p-4 space-y-3">

          <div className="flex gap-2">

            <button
              onClick={()=>setSearchType("text")}
              className={`flex-1 text-xs py-1.5 rounded-full ${
                searchType==="text"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
              }`}
            >
              Text
            </button>

            <button
              onClick={()=>setSearchType("date")}
              className={`flex-1 text-xs py-1.5 rounded-full ${
                searchType==="date"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
              }`}
            >
              Date
            </button>

          </div>

          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">

            <Search size={16} className="text-muted-foreground"/>

            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              type={searchType==="date" ? "date":"text"}
              placeholder={
                searchType==="date"
                ? "Select date"
                : "Search memories..."
              }
              className="flex-1 bg-transparent outline-none text-sm"
            />

          </div>

        </div>

        {/* MEMORY CARDS */}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No matching memories
          </div>
        )}

        {filtered.map((m)=>(
          <div
            key={m.id}
            className="bg-card rounded-2xl shadow-soft p-4 space-y-3"
          >

            <div className="flex items-center gap-3">

              <div className="bg-teal-light p-2 rounded-lg">
                <Clock size={16}/>
              </div>

              <div>

                <p className="font-medium text-sm">
                  {m.title}
                </p>

                <p className="text-xs text-muted-foreground">
                  {m.date}
                </p>

              </div>

            </div>

            {m.description && (
              <p className="text-sm text-muted-foreground">
                {m.description}
              </p>
            )}

            {m.photos && m.photos.length > 0 && (

              <div className="grid grid-cols-3 gap-2">

                {m.photos.map((p,i)=>(
                  <img
                    key={i}
                    src={p}
                    className="rounded-lg object-cover h-20 w-full"
                  />
                ))}

              </div>

            )}

          </div>
        ))}

      </main>

      <FloatingAI/>
      <BottomNav/>

    </div>
  );
};

export default ViewMemories;
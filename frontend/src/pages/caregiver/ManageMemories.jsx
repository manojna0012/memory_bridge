import { useState } from "react";
import { Plus, Clock, Trash2, Camera } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const ManageMemories = () => {

  const [memories,setMemories] =
    useLocalStorage("memorybridge_memories",[]);

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [date,setDate] = useState("");
  const [photos,setPhotos] = useState([]);

  const handlePhotos = (e) => {

    const files = Array.from(e.target.files);

    const readers = [];

    files.forEach(file => {

      const reader = new FileReader();

      reader.onload = () => {

        readers.push(reader.result);

        if(readers.length === files.length){
          setPhotos(readers);
        }

      };

      reader.readAsDataURL(file);

    });
  };

  const addMemory = ()=>{

    if(!title || !date) return;

    const memory = {
      id: crypto.randomUUID(),
      title,
      description,
      date,
      photos
    };

    setMemories([...memories,memory]);

    setTitle("");
    setDescription("");
    setDate("");
    setPhotos([]);
  };

  const removeMemory=(id)=>{
    setMemories(memories.filter(m=>m.id!==id));
  };

  return(

    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="Memories"
        subtitle="Add meaningful moments"
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Add Memory */}

        <div className="bg-card p-4 rounded-2xl shadow-soft space-y-3">

          <input
            placeholder="Memory title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="border border-border px-3 py-2 rounded-md w-full text-sm"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="border border-border px-3 py-2 rounded-md w-full text-sm"
          />

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="border border-border px-3 py-2 rounded-md w-full text-sm"
          />

          {/* Photo Upload */}

          <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">

            <Camera size={16}/>
            Upload photos

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotos}
            />

          </label>

          {/* Photo Preview */}

          {photos.length > 0 && (

            <div className="flex gap-2 flex-wrap">

              {photos.map((p,i)=>(
                <img
                  key={i}
                  src={p}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ))}

            </div>

          )}

          <button
            onClick={addMemory}
            className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
          >
            <Plus size={16}/> Add Memory
          </button>

        </div>

        {/* Memory List */}

        {memories.map((m)=>(
          <div
            key={m.id}
            className="bg-card p-4 rounded-xl shadow-soft flex justify-between"
          >

            <div>

              <p className="text-sm font-medium">
                {m.title}
              </p>

              <p className="text-xs text-muted-foreground">
                {m.date}
              </p>

            </div>

            <button onClick={()=>removeMemory(m.id)}>
              <Trash2 size={16} className="text-red-500"/>
            </button>

          </div>
        ))}

      </main>

      <BottomNav/>

    </div>
  );
};

export default ManageMemories;
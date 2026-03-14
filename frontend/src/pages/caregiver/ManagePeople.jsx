import { useState } from "react";
import { Plus, Trash2, User, Camera } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const ManagePeople = () => {

  const [people,setPeople] =
    useLocalStorage("memorybridge_people",[]);

  const [name,setName] = useState("");
  const [age,setAge] = useState("");
  const [relation,setRelation] = useState("");
  const [photos,setPhotos] = useState([]);

  const handlePhotos = (e) => {

    const files = Array.from(e.target.files).slice(0,3);

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

  const addPerson = async () => {

  if (!name) return;

  try {

    const formData = new FormData();

    formData.append("name", name);
    formData.append("age", age);
    formData.append("relation", relation);

    // convert base64 images to blobs
    for (let i = 0; i < photos.length; i++) {

      const blob = await fetch(photos[i]).then(res => res.blob());

      formData.append("photos", blob, `photo_${i}.jpg`);
    }

    const res = await fetch("http://localhost:5000/add_person", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    console.log("Saved:", data);

    const newPerson = {
      id: data.id,
      name,
      age,
      relation,
      photos
    };

    setPeople([...people, newPerson]);

    setName("");
    setAge("");
    setRelation("");
    setPhotos([]);

    alert("Person added successfully!");

  } catch (err) {

    console.error("Error saving person:", err);
    alert("Failed to save person");

  }

};

  const removePerson = (id)=>{
    setPeople(people.filter(p=>p.id!==id));
  };

  return (

    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="People"
        subtitle="Manage family & friends"
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Add Person */}

        <div className="bg-card p-4 rounded-2xl shadow-soft space-y-3">

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Name"
            className="border border-border rounded-md px-3 py-2 w-full text-sm"
          />

          <input
            value={age}
            onChange={(e)=>setAge(e.target.value)}
            placeholder="Age"
            type="number"
            className="border border-border rounded-md px-3 py-2 w-full text-sm"
          />

          <input
            value={relation}
            onChange={(e)=>setRelation(e.target.value)}
            placeholder="Relationship (e.g. Daughter)"
            className="border border-border rounded-md px-3 py-2 w-full text-sm"
          />

          {/* Photo Upload */}

          <label className="flex items-center gap-2 text-sm cursor-pointer text-primary">

            <Camera size={16}/>
            Upload up to 3 photos

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

            <div className="flex gap-2">

              {photos.map((p,i)=>(
                <img
                  key={i}
                  src={p}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ))}

            </div>

          )}

          <button
            onClick={addPerson}
            className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
          >
            <Plus size={16}/> Add Person
          </button>

        </div>

        {/* People List */}

        {people.map((p)=>(
          <div
            key={p.id}
            className="bg-card p-4 rounded-xl shadow-soft flex justify-between items-center"
          >

            <div>

              <p className="font-medium text-sm">
                {p.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {p.relation} • {p.age} yrs
              </p>

            </div>

            <button onClick={()=>removePerson(p.id)}>
              <Trash2 size={16} className="text-red-500"/>
            </button>

          </div>
        ))}

      </main>

      <BottomNav/>

    </div>
  );
};

export default ManagePeople;
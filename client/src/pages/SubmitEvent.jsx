import { useEffect, useState } from "react";
import api from "../api";

const empty = { name: "", city: "", state: "", location: "", lat: "", lng: "", category: "", startDate: "", endDate: "", description: "", significance: "", poster: "" };

export default function SubmitEvent() {
  const [f, setF] = useState(empty);
  const [cats, setCats] = useState([]);
  const [mine, setMine] = useState([]);
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = () => api.get("/events/mine").then((r) => setMine(r.data));
  useEffect(() => { api.get("/categories").then((r) => setCats(r.data)); load(); }, []);

  const submit = async () => {
    try {
      const body = { ...f, lat: f.lat ? Number(f.lat) : undefined, lng: f.lng ? Number(f.lng) : undefined };
      await api.post("/events", body);
      setMsg("Submitted! Awaiting admin approval.");
      setF(empty); load();
    } catch (e) { setMsg(e.response?.data?.message || "Error"); }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="text-xl font-bold">Submit an Event</h2>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <input placeholder="Event name" value={f.name} onChange={set("name")} className="border w-full p-2 rounded" />
        <div className="flex gap-2">
          <input placeholder="City" value={f.city} onChange={set("city")} className="border w-full p-2 rounded" />
          <input placeholder="State" value={f.state} onChange={set("state")} className="border w-full p-2 rounded" />
        </div>
        <input placeholder="Venue / location" value={f.location} onChange={set("location")} className="border w-full p-2 rounded" />
        <div className="flex gap-2">
          <input placeholder="Latitude" value={f.lat} onChange={set("lat")} className="border w-full p-2 rounded" />
          <input placeholder="Longitude" value={f.lng} onChange={set("lng")} className="border w-full p-2 rounded" />
        </div>
        <select value={f.category} onChange={set("category")} className="border w-full p-2 rounded">
          <option value="">Select category</option>
          {cats.map((c) => <option key={c._id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="date" value={f.startDate} onChange={set("startDate")} className="border w-full p-2 rounded" />
          <input type="date" value={f.endDate} onChange={set("endDate")} className="border w-full p-2 rounded" />
        </div>
        <textarea placeholder="Description" value={f.description} onChange={set("description")} className="border w-full p-2 rounded" />
        <textarea placeholder="Cultural significance" value={f.significance} onChange={set("significance")} className="border w-full p-2 rounded" />
        <input placeholder="Poster image URL" value={f.poster} onChange={set("poster")} className="border w-full p-2 rounded" />
        <button onClick={submit} className="bg-orange-600 text-white w-full py-2 rounded">Submit</button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">My Submissions</h2>
        {mine.map((e) => (
          <div key={e._id} className="border-b py-2 text-sm flex justify-between">
            <span>{e.name} ({e.city})</span>
            <span className="font-medium">{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import api, { assetUrl } from "../api";
import MapPicker from "../components/MapPicker";

const empty = { name: "", city: "", state: "", location: "", lat: "", lng: "", category: "", startDate: "", endDate: "", description: "", significance: "", poster: "" };

export default function SubmitEvent() {
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [cats, setCats] = useState([]);
  const [mine, setMine] = useState([]);
  const [msg, setMsg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = () => api.get("/events/mine").then((r) => setMine(r.data)).catch(() => {});
  useEffect(() => { api.get("/categories").then((r) => setCats(r.data)); load(); }, []);

  const uploadPoster = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("poster", file);
    setUploading(true);
    try {
      const r = await api.post("/events/upload", fd);
      setF((p) => ({ ...p, poster: r.data.url }));
    } catch (er) {
      setMsg({ err: true, text: er.response?.data?.message || "Upload failed" });
    } finally { setUploading(false); }
  };

  const startEdit = (e) => {
    setEditId(e._id);
    setF({
      name: e.name, city: e.city, state: e.state || "", location: e.location,
      lat: e.lat ?? "", lng: e.lng ?? "", category: e.category,
      startDate: e.startDate.slice(0, 10), endDate: e.endDate.slice(0, 10),
      description: e.description || "", significance: e.significance || "", poster: e.poster || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => { setF(empty); setEditId(null); };

  const submit = async () => {
    try {
      const body = { ...f, lat: f.lat === "" ? undefined : Number(f.lat), lng: f.lng === "" ? undefined : Number(f.lng) };
      if (editId) await api.put(`/events/${editId}`, body);
      else await api.post("/events", body);
      setMsg({ err: false, text: editId ? "Updated. It will be reviewed again by an admin." : "Submitted! Awaiting admin approval." });
      reset(); load();
    } catch (e) { setMsg({ err: true, text: e.response?.data?.message || "Something went wrong" }); }
  };

  const cancel = async (id) => {
    if (!confirm("Cancel this event? Visitors will see it marked as cancelled.")) return;
    try { await api.patch(`/events/${id}/cancel`); load(); }
    catch (e) { setMsg({ err: true, text: e.response?.data?.message || "Couldn't cancel" }); }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="text-xl font-bold">{editId ? "Edit event" : "Submit an Event"}</h2>
        {msg && <p className={`text-sm ${msg.err ? "text-red-600" : "text-green-700"}`}>{msg.text}</p>}
        <input placeholder="Event name" value={f.name} onChange={set("name")} className="border w-full p-2 rounded" />
        <div className="flex gap-2">
          <input placeholder="City" value={f.city} onChange={set("city")} className="border w-full p-2 rounded" />
          <input placeholder="State" value={f.state} onChange={set("state")} className="border w-full p-2 rounded" />
        </div>
        <input placeholder="Venue / location" value={f.location} onChange={set("location")} className="border w-full p-2 rounded" />
        <p className="text-xs text-gray-500">Click on the map to set the venue location.</p>
        <MapPicker lat={f.lat} lng={f.lng} onPick={(la, ln) => setF((p) => ({ ...p, lat: la, lng: ln }))} />
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
        <div>
          <label className="text-sm text-gray-600">Poster (JPG, PNG or WEBP, max 2 MB)</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPoster} className="block w-full text-sm mt-1" />
          {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
          {f.poster && <img src={assetUrl(f.poster)} alt="Poster preview" className="h-24 mt-2 rounded" />}
        </div>
        <div className="flex gap-2">
          <button onClick={submit} className="bg-orange-600 text-white flex-1 py-2 rounded">{editId ? "Save changes" : "Submit"}</button>
          {editId && <button onClick={reset} className="border px-4 rounded">Cancel edit</button>}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">My Submissions</h2>
        {mine.length === 0 && <p className="text-sm text-gray-500">You haven't submitted any events yet.</p>}
        {mine.map((e) => (
          <div key={e._id} className="border-b py-2 text-sm">
            <div className="flex justify-between">
              <span>{e.name} ({e.city})</span>
              <span className="font-medium">{e.status}</span>
            </div>
            {e.status !== "cancelled" && (
              <div className="flex gap-3 mt-1">
                <button onClick={() => startEdit(e)} className="text-blue-700">Edit</button>
                <button onClick={() => cancel(e._id)} className="text-red-700">Cancel event</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
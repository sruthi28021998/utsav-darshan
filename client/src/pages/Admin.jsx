import { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("pending");
  const [reports, setReports] = useState([]);
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState("");

  const load = async () => {
    setStats((await api.get("/admin/stats")).data);
    setEvents((await api.get("/admin/events", { params: { status } })).data);
    setReports((await api.get("/admin/reports")).data);
    setCats((await api.get("/categories")).data);
  };
  useEffect(() => { load(); }, [status]);

  const setSt = async (id, s) => { await api.patch(`/admin/events/${id}/status`, { status: s }); load(); };
  const del = async (id) => { if (confirm("Delete this event?")) { await api.delete(`/admin/events/${id}`); load(); } };
  const edit = async (e) => {
    const name = prompt("Event name", e.name);
    if (name) { await api.put(`/admin/events/${e._id}`, { name }); load(); }
  };
  const resolve = async (id) => { await api.patch(`/admin/reports/${id}/resolve`); load(); };
  const addCat = async () => { if (newCat) { await api.post("/categories", { name: newCat }); setNewCat(""); load(); } };
  const delCat = async (id) => { await api.delete(`/categories/${id}`); load(); };

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["Live events", stats.events], ["Pending", stats.pending], ["Users", stats.users], ["Open reports", stats.reports]].map(([k, v]) => (
            <div key={k} className="bg-white p-4 rounded shadow text-center">
              <div className="text-2xl font-bold">{v}</div><div className="text-sm text-gray-500">{k}</div>
            </div>
          ))}
        </div>
      )}

      <section className="bg-white p-4 rounded shadow">
        <div className="flex gap-2 mb-3 items-center">
          <h2 className="font-bold">Events</h2>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2">
            <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
        </div>
        {events.map((e) => (
          <div key={e._id} className="border-b py-2 flex flex-wrap gap-2 items-center text-sm">
            <span className="flex-1">{e.name} – {e.city} <i className="text-gray-500">by {e.contributor?.name}</i></span>
            <button onClick={() => setSt(e._id, "approved")} className="text-green-700">Approve</button>
            <button onClick={() => setSt(e._id, "rejected")} className="text-orange-700">Reject</button>
            <button onClick={() => edit(e)} className="text-blue-700">Edit</button>
            <button onClick={() => del(e._id)} className="text-red-700">Delete</button>
          </div>
        ))}
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Abuse / Misinformation Reports</h2>
        {reports.map((r) => (
          <div key={r._id} className="border-b py-2 text-sm flex justify-between">
            <span>{r.event?.name} ({r.event?.city}): {r.reason}</span>
            <button onClick={() => resolve(r._id)} className="text-green-700">Resolve</button>
          </div>
        ))}
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Categories</h2>
        <div className="flex gap-2 mb-2">
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category" className="border p-1 rounded" />
          <button onClick={addCat} className="bg-orange-600 text-white px-3 rounded">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <span key={c._id} className="bg-orange-100 px-2 py-1 rounded text-sm">
              {c.name} <button onClick={() => delCat(c._id)} className="text-red-600">×</button>
            </span>
          ))}
        </div>
      </section>

      {stats?.perCity?.length > 0 && (
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Events per City</h2>
          {stats.perCity.map((c) => <div key={c._id} className="text-sm">{c._id}: {c.count}</div>)}
        </section>
      )}
    </div>
  );
}
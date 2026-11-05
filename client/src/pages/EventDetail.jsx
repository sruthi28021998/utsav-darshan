import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { assetUrl } from "../api";

export default function EventDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [saves, setSaves] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((r) => { setEv(r.data); setSaves(r.data.saves); })
      .catch((e) => setErr(e.response?.status === 404 ? "This event isn't available." : "Couldn't load the event."));
  }, [id]);

  if (err) return <p className="text-red-600">{err} <Link to="/" className="underline">Back to events</Link></p>;
  if (!ev) return <p className="text-gray-500">Loading...</p>;

  const cancelled = ev.status === "cancelled";
  const save = async () => setSaves((await api.post(`/events/${id}/save`)).data.saves);
  const report = async () => {
    const reason = prompt("Reason for reporting?");
    if (!reason) return;
    try { await api.post("/reports", { event: id, reason }); alert("Report submitted"); }
    catch (e) { alert(e.response?.data?.message || "Couldn't submit report"); }
  };
  const share = () => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied"));

  const mapSrc = ev.lat && ev.lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${ev.lng - 0.01},${ev.lat - 0.01},${ev.lng + 0.01},${ev.lat + 0.01}&marker=${ev.lat},${ev.lng}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {cancelled && <div className="bg-red-50 text-red-700 p-3 rounded mb-3">This event has been cancelled by the organizer.</div>}
      {ev.poster && <img src={assetUrl(ev.poster)} alt={ev.name} className="w-full max-h-80 object-cover rounded mb-3" />}
      <h1 className="text-2xl font-bold">{ev.name}</h1>
      <p className="text-gray-600">{ev.category} • {ev.city}{ev.state && `, ${ev.state}`}</p>
      <p className="text-sm">{new Date(ev.startDate).toDateString()} – {new Date(ev.endDate).toDateString()}</p>
      <p className="mt-2">📍 {ev.location}</p>
      <h3 className="font-semibold mt-3">About</h3>
      <p>{ev.description}</p>
      <h3 className="font-semibold mt-3">Cultural Significance</h3>
      <p>{ev.significance}</p>
      {mapSrc && <iframe title="map" src={mapSrc} className="w-full h-64 mt-4 rounded border" />}
      <div className="flex gap-3 mt-4">
        <button onClick={save} className="bg-orange-600 text-white px-3 py-1 rounded">❤ Save ({saves})</button>
        <button onClick={share} className="border px-3 py-1 rounded">Share</button>
        <button onClick={report} className="border border-red-400 text-red-600 px-3 py-1 rounded">Report</button>
      </div>
    </div>
  );
}
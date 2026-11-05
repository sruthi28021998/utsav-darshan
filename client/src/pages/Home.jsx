import { useEffect, useState } from "react";
import api from "../api";
import EventCard from "../components/EventCard";
import CalendarView from "../components/CalendarView";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [cats, setCats] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [view, setView] = useState("list");
  const [cursor, setCursor] = useState(new Date());

  useEffect(() => {
    api.get("/events/cities").then((r) => setCities(r.data));
    api.get("/categories").then((r) => setCats(r.data));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      api.get("/events", { params: { city, category, q } }).then((r) => setEvents(r.data));
    }, 300);
    return () => clearTimeout(t);
  }, [city, category, q]);

  const now = new Date();
  const ongoing = events.filter((e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search event or city"
          className="border rounded px-3 py-2 flex-1 min-w-48" />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="border rounded px-2">
          <option value="">All cities</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-2">
          <option value="">All categories</option>
          {cats.map((c) => <option key={c._id}>{c.name}</option>)}
        </select>
        <select value={view} onChange={(e) => setView(e.target.value)} className="border rounded px-2">
          <option value="list">List</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>

      {ongoing.length > 0 && view === "list" && (
        <p className="mb-3 text-green-700 font-medium">🎉 {ongoing.length} event(s) happening now</p>
      )}

      {view === "list" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e) => <EventCard key={e._id} ev={e} />)}
          {events.length === 0 && <p>No events found.</p>}
        </div>
      ) : (
        <CalendarView events={events} mode={view} cursor={cursor} setCursor={setCursor} />
      )}
    </div>
  );
}
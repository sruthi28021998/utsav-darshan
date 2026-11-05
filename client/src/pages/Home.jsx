import { useEffect, useState } from "react";
import api from "../api";
import EventCard from "../components/EventCard";
import CalendarView from "../components/CalendarView";

const rangeFor = (view, cursor) => {
  if (view === "month")
    return [
      new Date(cursor.getFullYear(), cursor.getMonth(), 1),
      new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59),
    ];
  const s = new Date(cursor);
  s.setDate(cursor.getDate() - cursor.getDay());
  s.setHours(0, 0, 0, 0);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23, 59, 59);
  return [s, e];
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [cats, setCats] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [view, setView] = useState("list");
  const [cursor, setCursor] = useState(new Date());
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    api.get("/events/cities").then((r) => setCities(r.data)).catch(() => {});
    api.get("/categories").then((r) => setCats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const params = { city, category, q };
      if (view === "list") {
        params.page = page;
        params.limit = 9;
      } else {
        const [a, b] = rangeFor(view, cursor);
        params.from = a.toISOString();
        params.to = b.toISOString();
      }
      api
        .get("/events", { params })
        .then((r) => {
          if (view === "list") {
            setEvents(r.data.events);
            setPages(r.data.pages);
          } else setEvents(r.data);
          setErr("");
        })
        .catch(() => setErr("Couldn't load events. Check your connection and try again."))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [city, category, q, view, cursor, page, retry]);

  const upd = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const now = new Date();
  const ongoing = events.filter(
    (e) => e.status !== "cancelled" && new Date(e.startDate) <= now && new Date(e.endDate) >= now
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={q} onChange={upd(setQ)} placeholder="Search event or city"
          className="border rounded px-3 py-2 flex-1 min-w-48" />
        <select value={city} onChange={upd(setCity)} className="border rounded px-2">
          <option value="">All cities</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={category} onChange={upd(setCategory)} className="border rounded px-2">
          <option value="">All categories</option>
          {cats.map((c) => <option key={c._id}>{c.name}</option>)}
        </select>
        <select value={view} onChange={upd(setView)} className="border rounded px-2">
          <option value="list">List</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>

      {err && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-3 text-sm">
          {err} <button onClick={() => setRetry(retry + 1)} className="underline ml-2">Retry</button>
        </div>
      )}
      {loading && <p className="text-gray-500 mb-3">Loading events...</p>}

      {!loading && ongoing.length > 0 && view === "list" && (
        <p className="mb-3 text-green-700 font-medium">🎉 {ongoing.length} event(s) happening now</p>
      )}

      {view === "list" ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => <EventCard key={e._id} ev={e} />)}
          </div>
          {!loading && !err && events.length === 0 && <p>No events found.</p>}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded disabled:opacity-40">Prev</button>
              <span className="text-sm">Page {page} of {pages}</span>
              <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="border px-3 py-1 rounded disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      ) : (
        <CalendarView events={events} mode={view} cursor={cursor} setCursor={setCursor} />
      )}
    </div>
  );
}
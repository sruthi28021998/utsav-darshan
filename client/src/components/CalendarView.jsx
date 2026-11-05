import { useState } from "react";
import { Link } from "react-router-dom";

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function CalendarView({ events, mode, cursor, setCursor }) {
  const days = [];
  if (mode === "month") {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  } else {
    const sun = new Date(cursor);
    sun.setDate(cursor.getDate() - cursor.getDay());
    for (let i = 0; i < 7; i++) days.push(new Date(sun.getFullYear(), sun.getMonth(), sun.getDate() + i));
  }

  const eventsOn = (d) =>
    events.filter((e) => startOfDay(new Date(e.startDate)) <= d && startOfDay(new Date(e.endDate)) >= d);

  const shift = (n) => {
    const c = new Date(cursor);
    if (mode === "month") c.setMonth(c.getMonth() + n);
    else c.setDate(c.getDate() + 7 * n);
    setCursor(c);
  };

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => shift(-1)} className="px-2">◀</button>
        <b>{cursor.toLocaleString("default", { month: "long", year: "numeric" })}</b>
        <button onClick={() => shift(1)} className="px-2">▶</button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {days.map((d, i) =>
          d ? (
            <div key={i} className={`border rounded p-1 text-xs ${mode === "week" ? "min-h-32" : "min-h-16"}`}>
              <div className="text-gray-400">{d.getDate()}</div>
              {eventsOn(d).slice(0, mode === "week" ? 10 : 2).map((e) => (
                <Link key={e._id} to={`/event/${e._id}`} className="block truncate bg-orange-100 text-orange-800 rounded px-1 mb-0.5">
                  {e.name}
                </Link>
              ))}
            </div>
          ) : <div key={i} />
        )}
      </div>
    </div>
  );
}
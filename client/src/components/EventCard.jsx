import { Link } from "react-router-dom";

export default function EventCard({ ev }) {
  const now = new Date();
  const s = new Date(ev.startDate), e = new Date(ev.endDate);
  const badge = now >= s && now <= e ? "Ongoing" : s > now ? "Upcoming" : "Past";
  return (
    <Link to={`/event/${ev._id}`} className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden block">
      {ev.poster && <img src={ev.poster} alt={ev.name} loading="lazy" className="h-36 w-full object-cover" />}
      <div className="p-3">
        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{ev.category}</span>
        <span className="text-xs ml-2 text-green-700">{badge}</span>
        <h3 className="font-semibold mt-1">{ev.name}</h3>
        <p className="text-sm text-gray-600">{ev.city} • {ev.location}</p>
        <p className="text-xs text-gray-500">{s.toDateString()} – {e.toDateString()}</p>
      </div>
    </Link>
  );
}
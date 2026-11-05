import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPicker({ lat, lng, onPick }) {
  const el = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    const has = lat !== "" && lat != null && lng !== "" && lng != null;
    map.current = L.map(el.current).setView(has ? [Number(lat), Number(lng)] : [22.9734, 78.6569], has ? 13 : 4);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current);
    map.current.on("click", (e) => onPick(+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6)));
    return () => {
      map.current.remove();
      marker.current = null;
    };
  }, []);

  useEffect(() => {
    if (lat === "" || lat == null || lng === "" || lng == null) return;
    const pos = [Number(lat), Number(lng)];
    if (isNaN(pos[0]) || isNaN(pos[1])) return;
    if (marker.current) marker.current.setLatLng(pos);
    else marker.current = L.circleMarker(pos, { radius: 9, color: "#ea580c", fillOpacity: 0.8 }).addTo(map.current);
    map.current.setView(pos, Math.max(map.current.getZoom(), 13));
  }, [lat, lng]);

  return <div ref={el} className="h-56 w-full rounded border z-0" />;
}
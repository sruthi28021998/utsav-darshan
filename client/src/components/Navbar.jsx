import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-orange-600 text-white px-4 py-3 flex flex-wrap gap-4 items-center">
      <Link to="/" className="font-bold text-xl">🪔 Utsav Darshan</Link>
      <div className="ml-auto flex gap-4 items-center text-sm">
        <Link to="/submit">Submit Event</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {user ? (
          <button onClick={logout}>Logout ({user.name})</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
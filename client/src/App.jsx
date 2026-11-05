import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitEvent from "./pages/SubmitEvent";
import Admin from "./pages/Admin";
import { useAuth } from "./AuthContext";

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={user ? <SubmitEvent /> : <Navigate to="/login" />} />
          <Route
            path="/admin"
            element={user?.role === "admin" ? <Admin /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<p className="text-center mt-10">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}
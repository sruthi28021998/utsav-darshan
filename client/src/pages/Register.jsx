import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "", contact: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    try { login((await api.post("/auth/register", f)).data); nav("/"); }
    catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow space-y-3">
      <h2 className="text-xl font-bold">Register</h2>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <input placeholder="Name" className="border w-full p-2 rounded" onChange={set("name")} />
      <input placeholder="Email" className="border w-full p-2 rounded" onChange={set("email")} />
      <input placeholder="Contact (optional)" className="border w-full p-2 rounded" onChange={set("contact")} />
      <input type="password" placeholder="Password" className="border w-full p-2 rounded" onChange={set("password")} />
      <button onClick={submit} className="bg-orange-600 text-white w-full py-2 rounded">Create account</button>
    </div>
  );
}
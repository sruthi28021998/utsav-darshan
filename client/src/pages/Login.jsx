import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async () => {
    try { login((await api.post("/auth/login", f)).data); nav("/"); }
    catch (e) { setErr(e.response?.data?.message || "Error"); }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow space-y-3">
      <h2 className="text-xl font-bold">Login</h2>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <input placeholder="Email" className="border w-full p-2 rounded" onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input type="password" placeholder="Password" className="border w-full p-2 rounded" onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button onClick={submit} className="bg-orange-600 text-white w-full py-2 rounded">Login</button>
    </div>
  );
}
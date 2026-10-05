import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@bajfaj.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // Parameterised - fixes your original question
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_email', data.email);
      nav('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={login} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">Bajfaj Login</h1>
        <p className="text-xs text-gray-500 mb-4">API: {API_URL}</p>
        <input className="w-full border p-2 mb-3" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full border p-2 mb-4" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" disabled={loading} className="w-full bg-black text-white p-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
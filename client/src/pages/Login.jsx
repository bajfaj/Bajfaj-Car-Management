import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('admin@bajfaj.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-bold mb-6">Bajfaj Login</h1>
        {error && <div data-testid="login-error" className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>}
        <input data-testid="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2.5 border rounded mb-3" required />
        <input data-testid="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2.5 border rounded mb-4" required />
        <button data-testid="login-button" type="submit" disabled={loading} className="w-full bg-black text-white p-2.5 rounded hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
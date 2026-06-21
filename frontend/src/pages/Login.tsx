import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = async ( e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try{
        const response = await fetch('https://internship-recruitment-management-system.onrender.com/auth/login', {
            method : 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({email,password}),
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error ( data.message || 'Login failed')
        }

        localStorage.setItem('token',data.token);

        navigate('/candidate');
        }
        catch(error: any){
            setError(error.message);
        }
    }
    
    return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Welcome Back
        </h2>

        {/* Display errors if they exist */}
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="admin@system.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
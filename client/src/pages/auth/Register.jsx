import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import RoleSelector from '../../components/auth/RoleSelector';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardPath, ROLES } from '../../types/roles';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.CANDIDATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await register({ fullName: name, email, password, role });
      navigate(getDashboardPath(user?.role || role));
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create an account" subtitle="Get started with HirePilot.ai">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300">Full name</label>
          <div className="mt-1">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md bg-[#060606] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Email address</label>
          <div className="mt-1">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md bg-[#060606] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <div className="mt-1">
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md bg-[#060606] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <RoleSelector value={role} onChange={setRole} />

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </div>

        <div className="text-sm text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-400">Sign in</Link>
        </div>
      </form>
    </AuthCard>
  );
}

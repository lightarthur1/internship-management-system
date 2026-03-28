import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import { Layout, Mail, Lock, User, Briefcase, GraduationCap, Users, AlertCircle } from 'lucide-react';
import '../Styles/SignUp.css';

// ── Admin role is intentionally NOT listed here.
// Admin logs in via the normal Login page using the secret credentials.
// The backend will recognise the admin credentials and return an admin token.

const ROLES = [
  { id: 'student',               label: 'Student',               Icon: GraduationCap },
  { id: 'academic-supervisor',   label: 'Academic Supervisor',   Icon: Briefcase     },
  { id: 'workplace-supervisor',  label: 'Workplace Supervisor',  Icon: Users         },
];

const roleRoutes = {
  student:              '/student',
  'academic-supervisor':  '/academic-supervisor',
  'workplace-supervisor': '/workplace-supervisor',
};

const Signup = () => {
  const [role,     setRole]     = useState('student');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { signup } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signup({ name, email, password, role });
      navigate(roleRoutes[user.role] || '/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Layout size={32} />
            <span>IMS Portal</span>
          </Link>
          <h1>Create Account</h1>
          <p>Join the Internship Management System</p>
        </div>

        <div className="role-selector">
          <p>Select your role:</p>
          <div className="role-options">
            {ROLES.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`role-btn ${role === id ? 'active' : ''}`}
                onClick={() => setRole(id)}
                type="button"
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, marginBottom:16, color:'#b91c1c', fontSize:13 }}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
          </div>

          <button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="footer-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

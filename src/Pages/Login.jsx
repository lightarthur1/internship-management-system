import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import { Layout, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import '../Styles/Login.css';

const roleRoutes = {
  admin:                '/admin',
  'academic-supervisor':  '/academic-supervisor',
  'workplace-supervisor': '/workplace-supervisor',
  student:              '/student',
};

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(roleRoutes[user.role] || '/login');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-ims-link">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-container"><Layout size={50} /></div>
              <span className="ims-header">IMS Portal</span>
            </Link>
          </div>
          <h1>Welcome Back</h1>
          <p>Login to your account to continue</p>
        </div>

        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, marginBottom:16, color:'#b91c1c', fontSize:13 }}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
              <input type={showPassword ? "text" : "password"} placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
              {/* 3. Add the toggle button */}
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : <><span>Sign In</span> </>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup" className="footer-link">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

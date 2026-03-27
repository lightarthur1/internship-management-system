import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import { Layout, Mail, Lock, ArrowRight } from 'lucide-react';
import '../Styles/Login.css'


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const loggedInUser = await login(email, password);

            if (loggedInUser) {
                switch (loggedInUser.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'academic-supervisor':
                        navigate('/academic-supervisor');
                        break;
                    case 'workplace-supervisor':
                        navigate('/workplace-supervisor');
                        break;
                    case 'student':
                        navigate('/student');
                        break;
                    default:
                        navigate('/login');
                }
            } else {
                alert("Invalid email or password");
            }
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Login failed. Please check your credentials.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-ims-link">
                    <Link to="/" className="auth-logo">
                    <div className="auth-logo-container">
                        <Layout size={50} />
                        </div>
                        <span className='ims-header'>IMS Portal</span>
                    </Link>
                    </div>

                    <h1>Welcome Back</h1>
                    <p>Login to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-options">
                        <label className="checkbox-label">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup" className='footer-link'>Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

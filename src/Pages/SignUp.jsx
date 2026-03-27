import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import { Layout, Mail, Lock, User, Briefcase, GraduationCap, Users } from 'lucide-react';
import '../Styles/SignUp.css'

const Signup = () => {
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const roleRoutes = {
        student: '/student',
        'academic-supervisor': '/academic-supervisor',
        'workplace-supervisor': '/workplace-supervisor',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await signup({ name, email, password, role });
            const destination = roleRoutes[role] || '/login';
            navigate(destination);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Signup failed. Please check your details.";
            alert(message);
        } finally {
            setSubmitting(false);
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
                        <button
                            className={`role-btn ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            <GraduationCap size={20} />
                            <span>Student</span>
                        </button>
                        <button
                            className={`role-btn ${role === 'academic-supervisor' ? 'active' : ''}`}
                            onClick={() => setRole('academic-supervisor')}
                        >
                            <Briefcase size={20} />
                            <span>Academic Supervisor</span>
                        </button>

                        <button
                            className={`role-btn ${role === 'workplace-supervisor' ? 'active' : ''}`}
                            onClick={() => setRole('workplace-supervisor')}
                        >
                            <Users size={20} />
                            <span>Workplace Supervisor</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}
                className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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

                    <button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className='footer-link'>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;

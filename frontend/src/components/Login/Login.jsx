import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../../services/authService';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginService(email.trim(), password);
    if (!res) {
      setError('Invalid email or password');
      return;
    }
    onLogin(res.token, res.role);
    if (res.role === 'ADMIN' || res.role === 'ORGANIZER') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="login-card">
      <h2>Login</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <div className="hint">
        Demo users: admin@example.com/admin123
      </div>
    </div>
  );
};

export default Login;

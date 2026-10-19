import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const AUTH_URL = 'http://localhost:5001';
const API_URL = 'http://localhost:5002';

function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${AUTH_URL}/login`, loginForm);
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      setSuccess('Login successful!');
      setLoginForm({ username: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await axios.post(`${AUTH_URL}/register`, registerForm);
      setSuccess('Registration successful! You can now login.');
      setRegisterForm({ username: '', password: '', email: '', role: 'user' });
      setActiveTab('login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setApiResponse(null);
    localStorage.removeItem('token');
    setSuccess('Logged out successfully');
  };

  const testPublicEndpoint = async () => {
    setError('');
    try {
      const response = await axios.get(`${API_URL}/public`);
      setApiResponse({ endpoint: 'Public', data: response.data, status: 'Success' });
    } catch (err) {
      setError('Failed to access public endpoint');
    }
  };

  const testProtectedEndpoint = async () => {
    setError('');
    if (!token) {
      setError('Please login first');
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiResponse({ endpoint: 'Protected Data', data: response.data, status: 'Success' });
    } catch (err) {
      setError(err.response?.data?.error || 'Access denied');
      setApiResponse({ endpoint: 'Protected Data', error: err.response?.data, status: 'Failed' });
    }
  };

  const testCreateData = async () => {
    setError('');
    if (!token) {
      setError('Please login first');
      return;
    }
    
    try {
      const response = await axios.post(
        `${API_URL}/data`,
        { content: 'Test data from React frontend' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiResponse({ endpoint: 'Create Data', data: response.data, status: 'Success' });
      setSuccess('Data created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create data');
      setApiResponse({ endpoint: 'Create Data', error: err.response?.data, status: 'Failed' });
    }
  };

  const testAdminEndpoint = async () => {
    setError('');
    if (!token) {
      setError('Please login first');
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiResponse({ endpoint: 'Admin Only', data: response.data, status: 'Success' });
    } catch (err) {
      setError(err.response?.data?.error || 'Access denied');
      setApiResponse({ endpoint: 'Admin Only', error: err.response?.data, status: 'Failed' });
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Authentication & Authorization</h1>
      <p className="page-subtitle">Task 4: JWT + RBAC Microservice</p>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="auth-layout">
        <div className="auth-section">
          {!token ? (
            <>
              <div className="auth-tabs">
                <button
                  className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button
                  className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  Register
                </button>
              </div>

              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                  
                  <div className="default-accounts">
                    <p><strong>Test Accounts:</strong></p>
                    <ul>
                      <li>admin / admin123 (Admin)</li>
                      <li>user / user123 (User)</li>
                      <li>guest / guest123 (Guest)</li>
                    </ul>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-input"
                      value={registerForm.role}
                      onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
                    >
                      <option value="user">User</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Register
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="user-info">
              <h3>Logged In</h3>
              <div className="info-card">
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Role:</strong> <span className="role-badge">{user?.role}</span></p>
                <p><strong>Permissions:</strong></p>
                <ul className="permissions-list">
                  {user?.permissions?.map((perm, idx) => (
                    <li key={idx}>{perm}</li>
                  ))}
                </ul>
              </div>
              <button className="btn btn-danger btn-block" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="api-test-section">
          <h3>API Endpoint Testing</h3>
          
          <div className="test-buttons">
            <button className="btn btn-secondary" onClick={testPublicEndpoint}>
              Test Public Endpoint
            </button>
            <button className="btn btn-primary" onClick={testProtectedEndpoint} disabled={!token}>
              Test Protected Endpoint
            </button>
            <button className="btn btn-success" onClick={testCreateData} disabled={!token}>
              Test Create Data
            </button>
            <button className="btn btn-primary" onClick={testAdminEndpoint} disabled={!token}>
              Test Admin Endpoint
            </button>
          </div>

          {apiResponse && (
            <div className="api-response">
              <h4>Response: {apiResponse.endpoint}</h4>
              <div className={`response-status ${apiResponse.status === 'Success' ? 'success' : 'error'}`}>
                Status: {apiResponse.status}
              </div>
              <pre className="response-data">
                {JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

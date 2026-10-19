import React, { useState, useEffect } from 'react';
import './DataPage.css';

const API_URL = 'http://localhost:3000/api';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      setMessage('❌ Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/users/${editingId}`
        : `${API_URL}/users`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ User ${editingId ? 'updated' : 'created'} successfully!`);
        setFormData({ name: '', email: '', age: '' });
        setEditingId(null);
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age || ''
    });
    setEditingId(user.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessage('✅ User deleted successfully!');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error deleting user: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', age: '' });
    setEditingId(null);
  };

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>👥 Users Management</h1>
        <p className="subtitle">Task 2 - REST API CRUD Operations</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="form-section">
        <h2>{editingId ? '✏️ Edit User' : '➕ Add New User'}</h2>
        <form onSubmit={handleSubmit} className="data-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter full name"
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="user@example.com"
            />
          </div>
          
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="Optional"
              min="1"
              max="120"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '💾 Update User' : '➕ Create User'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📋 All Users ({users.length})</h2>
          <button onClick={fetchUsers} className="btn btn-refresh">
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">⏳ Loading users...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>📭 No users found. Create your first user above!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.age || '-'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;

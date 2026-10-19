import React, { useState, useEffect } from 'react';
import './DataPage.css';

const API_URL = 'http://localhost:3000/api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      setMessage('❌ Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Product ${editingId ? 'updated' : 'created'} successfully!`);
        setFormData({ name: '', description: '', price: '', stock: '' });
        setEditingId(null);
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock || 0
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessage('✅ Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error deleting product: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '', stock: '' });
    setEditingId(null);
  };

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>📦 Products Management</h1>
        <p className="subtitle">Task 2 - REST API CRUD Operations</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="form-section">
        <h2>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="data-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter product name"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Optional product description"
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '💾 Update Product' : '➕ Create Product'}
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
          <h2>📋 All Products ({products.length})</h2>
          <button onClick={fetchProducts} className="btn btn-refresh">
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">⏳ Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>📭 No products found. Create your first product above!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td><strong>{product.name}</strong></td>
                    <td className="description">{product.description || '-'}</td>
                    <td className="price">₹{product.price.toLocaleString()}</td>
                    <td className="stock">
                      <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td>{new Date(product.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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

export default ProductsPage;

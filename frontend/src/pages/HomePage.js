import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Progree</h1>
        <p className="hero-subtitle">Backend Development Internship Platform</p>
        <div className="hero-features">
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>REST API</h3>
            <p>Full CRUD operations with SQLite database</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💬</span>
            <h3>Real-Time Chat</h3>
            <p>WebSocket-based chat with multiple channels</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔐</span>
            <h3>Authentication</h3>
            <p>JWT-based auth with role-based access control</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>About the Platform</h2>
        <p>
          This platform demonstrates three core backend development tasks:
        </p>
        <ul className="task-list">
          <li>
            <strong>Task 2: REST API</strong> - Manage users and products with full CRUD operations
          </li>
          <li>
            <strong>Task 3: WebSocket Chat</strong> - Real-time communication with Redis caching
          </li>
          <li>
            <strong>Task 4: Microservice Auth</strong> - JWT authentication with RBAC and message queues
          </li>
        </ul>
      </div>

      <div className="tech-stack">
        <h2>Technology Stack</h2>
        <div className="tech-grid">
          <div className="tech-item">Node.js</div>
          <div className="tech-item">Express</div>
          <div className="tech-item">React</div>
          <div className="tech-item">Socket.io</div>
          <div className="tech-item">SQLite</div>
          <div className="tech-item">Redis</div>
          <div className="tech-item">JWT</div>
          <div className="tech-item">RabbitMQ</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

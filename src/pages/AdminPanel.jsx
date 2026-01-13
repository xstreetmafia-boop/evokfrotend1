import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function AdminPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(false);

    // User Management State
    const [users, setUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });

    // Analytics State
    const [analytics, setAnalytics] = useState(null);

    // Activity Logs State
    const [activityLogs, setActivityLogs] = useState([]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'analytics') {
            fetchAnalytics();
        } else if (activeTab === 'logs') {
            fetchActivityLogs();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            alert('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityLogs = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getActivityLogs();
            setActivityLogs(data);
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            alert('Failed to fetch activity logs');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.createUser(newUser);
            setShowUserModal(false);
            setNewUser({ username: '', email: '', password: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.updateUser(editingUser._id, {
                username: editingUser.username,
                email: editingUser.email,
                role: editingUser.role
            });
            setShowUserModal(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminAPI.deleteUser(id);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setShowUserModal(true);
    };

    const closeModal = () => {
        setShowUserModal(false);
        setEditingUser(null);
        setNewUser({ username: '', email: '', password: '', role: 'user' });
    };

    // Check if user is admin
    if (user?.role !== 'admin') {
        return (
            <div className="admin-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You do not have permission to access the admin panel.</p>
                <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header glass" style={{ marginBottom: '2rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    ← Back
                </button>
                <div>
                    <h1 style={{ margin: 0 }}>Admin Panel</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Manage users, view analytics, and monitor system activity</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="admin-tabs glass" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'users' ? 'var(--accent-primary)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: activeTab === 'users' ? '#fff' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    👥 User Management
                </button>
                <button
                    className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'analytics' ? 'var(--accent-primary)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: activeTab === 'analytics' ? '#fff' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    📊 Analytics
                </button>
                <button
                    className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'logs' ? 'var(--accent-primary)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: activeTab === 'logs' ? '#fff' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    📋 Activity Logs
                </button>
            </div>

            {/* User Management Tab */}
            {activeTab === 'users' && (
                <div className="users-section glass" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2>User Management</h2>
                        <button
                            className="btn-primary"
                            onClick={() => setShowUserModal(true)}
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            + Add New User
                        </button>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</p>
                    ) : (
                        <table className="leads-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td><strong>{u.username}</strong></td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-edit" onClick={() => openEditModal(u)}>✏️ Edit</button>
                                                <button className="btn-delete" onClick={() => handleDeleteUser(u._id)}>🗑️ Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="analytics-section">
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics...</p>
                    ) : analytics ? (
                        <>
                            <div className="stats-ribbon" style={{ marginBottom: '2rem' }}>
                                <div className="ribbon-item glass">
                                    <span className="ribbon-label">Total Users</span>
                                    <span className="ribbon-value" style={{ color: '#60a5fa' }}>{analytics.totalUsers}</span>
                                </div>
                                <div className="ribbon-item glass">
                                    <span className="ribbon-label">Total Leads</span>
                                    <span className="ribbon-value" style={{ color: '#a855f7' }}>{analytics.totalLeads}</span>
                                </div>
                            </div>

                            <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Leads by Status</h3>
                                <div className="distribution-chart">
                                    {analytics.leadsByStatus.map(item => {
                                        const percentage = (item.count / analytics.totalLeads) * 100;
                                        return (
                                            <div key={item._id} className="chart-row">
                                                <div className="chart-label">
                                                    <span>{item._id || 'Unknown'}</span>
                                                    <span className="chart-count">{item.count}</span>
                                                </div>
                                                <div className="chart-track">
                                                    <div className="chart-bar" style={{ width: `${percentage}%`, backgroundColor: '#60a5fa' }}></div>
                                                </div>
                                                <span className="chart-percentage">{Math.round(percentage)}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="glass" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Top Districts by Leads</h3>
                                <div className="distribution-chart">
                                    {analytics.leadsByDistrict.map(item => {
                                        const percentage = (item.count / analytics.totalLeads) * 100;
                                        return (
                                            <div key={item._id} className="chart-row">
                                                <div className="chart-label">
                                                    <span>{item._id || 'Unknown'}</span>
                                                    <span className="chart-count">{item.count}</span>
                                                </div>
                                                <div className="chart-track">
                                                    <div className="chart-bar" style={{ width: `${percentage}%`, backgroundColor: '#a855f7' }}></div>
                                                </div>
                                                <span className="chart-percentage">{Math.round(percentage)}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === 'logs' && (
                <div className="logs-section glass" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Activity Logs</h2>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading activity logs...</p>
                    ) : (
                        <div className="log-list">
                            {activityLogs.length > 0 ? (
                                activityLogs.map((log, index) => (
                                    <div key={index} className="log-entry" style={{
                                        padding: '1rem',
                                        marginBottom: '1rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div className="log-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '600' }}>{log.business}</span>
                                            <span className="log-date" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{log.date}</span>
                                        </div>
                                        <div className="log-path" style={{ marginBottom: '0.5rem' }}>
                                            <span className="badge badge-info">{log.from}</span>
                                            <span style={{ margin: '0 0.5rem' }}>➜</span>
                                            <span className="badge badge-success">{log.to}</span>
                                        </div>
                                        <p className="log-note" style={{ color: 'var(--text-muted)', margin: 0 }}>{log.note}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-logs" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No activity logs found.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* User Modal */}
            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    required
                                    value={editingUser ? editingUser.username : newUser.username}
                                    onChange={(e) => editingUser
                                        ? setEditingUser({ ...editingUser, username: e.target.value })
                                        : setNewUser({ ...newUser, username: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={editingUser ? editingUser.email : newUser.email}
                                    onChange={(e) => editingUser
                                        ? setEditingUser({ ...editingUser, email: e.target.value })
                                        : setNewUser({ ...newUser, email: e.target.value })
                                    }
                                />
                            </div>
                            {!editingUser && (
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={editingUser ? editingUser.role : newUser.role}
                                    onChange={(e) => editingUser
                                        ? setEditingUser({ ...editingUser, role: e.target.value })
                                        : setNewUser({ ...newUser, role: e.target.value })
                                    }
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-primary">{editingUser ? 'Update' : 'Create'} User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;

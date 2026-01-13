import React, { useState, useEffect } from 'react'
import '../App.css'
import '../calendar.css'
import evokLogo from '../assets/evok_logo_final.png'
import { leadAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MeetingCalendar from '../components/MeetingCalendar'

const STATUS_OPTIONS = [
  "New", "Contacted", "Meeting Scheduled", "Quote Issued", "Quote Revised",
  "Under Negotiation", "Tried To Connect", "Future Project",
  "Forwarded", "Won", "Lost"
];

const DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

function Dashboard() {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [newLead, setNewLead] = useState({ business: '', contact: '', status: 'New', location: '', district: 'Thiruvananthapuram' });

  // Status Log States
  const [pendingStatus, setPendingStatus] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNote, setReminderNote] = useState('');

  // Navigation State
  const [currentView, setCurrentView] = useState('leads');

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadAPI.getAll();
      // Map MongoDB _id to id for frontend compatibility
      const mappedLeads = data.map(lead => ({
        ...lead,
        id: lead._id
      }));
      setLeads(mappedLeads);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await leadAPI.create(newLead);
      await fetchLeads(); // Refresh the list
      setShowModal(false);
      setNewLead({ business: '', contact: '', status: 'New', location: '', district: 'Thiruvananthapuram' });
    } catch (err) {
      console.error('Error creating lead:', err);
      alert('Failed to create lead. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === 'won') return 'badge-success';
    if (s === 'lost') return 'badge-danger';
    if (s.includes('negotiation') || s.includes('quote')) return 'badge-warning';
    if (s.includes('forwarded') || s.includes('contact')) return 'badge-info';
    return 'badge-neutral';
  };

  const handleStatusChangeRequest = (id, newStatus) => {
    const lead = leads.find(l => l.id === id);
    if (lead.status === newStatus) return;
    setPendingStatus({ id, from: lead.status, to: newStatus, business: lead.business });
  };

  const finalizeStatusChange = async () => {
    try {
      const updateData = {
        status: pendingStatus.to,
        note: statusNote || 'No description provided'
      };

      // If status is "Meeting Scheduled", include meeting and reminder dates
      if (pendingStatus.to === 'Meeting Scheduled') {
        if (meetingDate) updateData.meetingDate = meetingDate;
        if (reminderDate) updateData.reminderDate = reminderDate;
        if (reminderNote) updateData.reminderNote = reminderNote;
      }

      await leadAPI.update(pendingStatus.id, updateData);
      await fetchLeads(); // Refresh the list
      setPendingStatus(null);
      setStatusNote('');
      setMeetingDate('');
      setReminderDate('');
      setReminderNote('');
    } catch (err) {
      console.error('Error updating lead:', err);
      alert('Failed to update lead status. Please try again.');
    }
  };

  const handleViewDetails = (id) => {
    const lead = leads.find(l => l.id === id);
    setPendingStatus({ id, from: lead.status, to: lead.status, business: lead.business, isViewing: true });
  };

  const handleEditLead = (lead) => {
    setEditingLead({
      ...lead,
      id: lead.id || lead._id
    });
    setShowEditModal(true);
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      await leadAPI.update(editingLead.id, editingLead);
      await fetchLeads();
      setShowEditModal(false);
      setEditingLead(null);
    } catch (err) {
      console.error('Error updating lead:', err);
      alert('Failed to update lead. Please try again.');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await leadAPI.delete(id);
      await fetchLeads();
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('Failed to delete lead. Please try again.');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <nav className="sidebar glass">
        <div className="logo-section">
          <img src={evokLogo} alt="EVOK Logo" className="sidebar-logo" />
        </div>

        <ul className="nav-links">
          <li
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={currentView === 'leads' ? 'active' : ''}
            onClick={() => setCurrentView('leads')}
          >
            Lead List
          </li>
          <li>Site Analysis</li>
          <li>Partners</li>
          <li>Settings</li>
        </ul>

        <MeetingCalendar
          leads={leads}
          onDateClick={(date, meetings) => {
            console.log('Selected date:', date, 'Meetings:', meetings);
          }}
        />

        <div className="nav-footer">
          <p>Logged in as</p>
          <strong>{user?.username || 'User'}</strong>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="welcome-text">
            <h1>Good Afternoon!</h1>
            <p>Here's what's happening with your EV network expansion.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <span>+</span> NEW BUSINESS LEAD
          </button>
        </header>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>Loading leads...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            padding: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>
            <button
              onClick={fetchLeads}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content glass">
              <h2>Add Business Lead</h2>
              <form onSubmit={handleAddLead}>
                <div className="form-group">
                  <label>Client Name</label>
                  <input type="text" required value={newLead.business} onChange={e => setNewLead({ ...newLead, business: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" required value={newLead.contact} onChange={e => setNewLead({ ...newLead, contact: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" required value={newLead.location} onChange={e => setNewLead({ ...newLead, location: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>District</label>
                    <select value={newLead.district} onChange={e => setNewLead({ ...newLead, district: e.target.value })}>
                      {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Initial Status</label>
                  <select value={newLead.status} onChange={e => setNewLead({ ...newLead, status: e.target.value })}>
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Lead</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Lead Modal */}
        {showEditModal && editingLead && (
          <div className="modal-overlay">
            <div className="modal-content glass">
              <h2>Edit Lead</h2>
              <form onSubmit={handleUpdateLead}>
                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    required
                    value={editingLead.business}
                    onChange={e => setEditingLead({ ...editingLead, business: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    required
                    value={editingLead.contact}
                    onChange={e => setEditingLead({ ...editingLead, contact: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      required
                      value={editingLead.location}
                      onChange={e => setEditingLead({ ...editingLead, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>District</label>
                    <select
                      value={editingLead.district}
                      onChange={e => setEditingLead({ ...editingLead, district: e.target.value })}
                    >
                      {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingLead.status}
                    onChange={e => setEditingLead({ ...editingLead, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Update Lead</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Activity Log Popup */}
        {pendingStatus && (
          <div className="modal-overlay">
            <div className="modal-content glass log-popup">
              <div className="log-header">
                <h3>Activity Log: Status Update</h3>
                <p>Updating <strong>{pendingStatus.business}</strong></p>
              </div>

              <div className="status-flow">
                <span className={`badge ${getStatusClass(pendingStatus.from)}`}>{pendingStatus.from}</span>
                {pendingStatus.from !== pendingStatus.to && (
                  <>
                    <span className="flow-arrow">➜</span>
                    <span className={`badge ${getStatusClass(pendingStatus.to)}`}>{pendingStatus.to}</span>
                  </>
                )}
              </div>

              {pendingStatus.isViewing && (
                <div className="lead-info-display">
                  <div className="info-item">
                    <label>Contact Number</label>
                    <p>{leads.find(l => l.id === pendingStatus.id)?.contact}</p>
                  </div>
                  <div className="info-item">
                    <label>Location & District</label>
                    <p>{leads.find(l => l.id === pendingStatus.id)?.location}, {leads.find(l => l.id === pendingStatus.id)?.district}</p>
                  </div>
                </div>
              )}


              {!pendingStatus.isViewing && (
                <>
                  {/* Show date pickers when status is "Meeting Scheduled" */}
                  {pendingStatus.to === 'Meeting Scheduled' && (
                    <>
                      <div className="date-picker-group">
                        <label>📅 Meeting Date & Time</label>
                        <input
                          type="datetime-local"
                          value={meetingDate}
                          onChange={(e) => setMeetingDate(e.target.value)}
                        />
                      </div>

                      <div className="date-picker-group">
                        <label>⏰ Reminder Date & Time</label>
                        <input
                          type="datetime-local"
                          value={reminderDate}
                          onChange={(e) => setReminderDate(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>📝 Reminder Note</label>
                        <textarea
                          placeholder="e.g., Call client 1 day before meeting..."
                          value={reminderNote}
                          onChange={(e) => setReminderNote(e.target.value)}
                          className="log-textarea"
                          rows="2"
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Add Activity Note</label>
                    <textarea
                      placeholder="e.g., Client requested revision on quote price..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="log-textarea"
                    />
                  </div>
                </>
              )}

              <div className="history-preview">
                <label>Previous Activities</label>
                <div className="log-list">
                  {(leads.find(l => l.id === pendingStatus.id)?.logs || []).length > 0 ? (
                    leads.find(l => l.id === pendingStatus.id).logs.map((log, i) => (
                      <div key={i} className="log-entry">
                        <div className="log-meta">
                          <span className="log-date">{log.date}</span>
                          <span className="log-path">{log.from} ➜ {log.to}</span>
                        </div>
                        <p className="log-note">{log.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-logs">No previous activity logs found.</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setPendingStatus(null)}>Close</button>
                {!pendingStatus.isViewing && (
                  <button className="btn-primary" onClick={finalizeStatusChange}>Log Activity & Save</button>
                )}
              </div>
            </div>
          </div>
        )}
        {currentView === 'dashboard' ? (
          <div className="dashboard-view glass">
            <div className="dashboard-header">
              <h2>Leads by Status</h2>
              <p>Distribution of leads across the sales funnel for the selected period.</p>
            </div>

            <div className="dashboard-chart-container">
              <div className="chart-y-axis">
                <span>60</span>
                <span>45</span>
                <span>30</span>
                <span>15</span>
                <span>0</span>
              </div>
              <div className="chart-grid-area">
                {/* Grid Lines */}
                <div className="grid-line" style={{ bottom: '0%' }}></div>
                <div className="grid-line" style={{ bottom: '25%' }}></div>
                <div className="grid-line" style={{ bottom: '50%' }}></div>
                <div className="grid-line" style={{ bottom: '75%' }}></div>
                <div className="grid-line" style={{ bottom: '100%' }}></div>

                {/* Bars */}
                {['New', 'Contacted', 'Meeting Scheduled', 'Under Negotiation', 'Won', 'Lost'].map((status, index) => {
                  const count = leads.filter(l => l.status === status).length;
                  // Max Y-axis value is 60. Calculate percentage relative to 60.
                  const maxVal = 60;
                  const heightPercentage = Math.min((count / maxVal) * 100, 100);

                  return (
                    <div key={status} className="vertical-bar-group">
                      <div
                        className="vertical-bar"
                        style={{ height: `${heightPercentage}%` }}
                      >
                        <span className="bar-value">{count}</span>
                      </div>
                      <span className="x-axis-label">{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="stats-ribbon">
              <div className="ribbon-item">
                <span className="ribbon-label">Total Leads</span>
                <span className="ribbon-value">{leads.length}</span>
              </div>
              <div className="ribbon-item">
                <span className="ribbon-label">Pending</span>
                <span className="ribbon-value" style={{ color: '#60a5fa' }}>{leads.filter(l => l.status === 'New').length}</span>
              </div>
              <div className="ribbon-item">
                <span className="ribbon-label">Meetings</span>
                <span className="ribbon-value" style={{ color: '#a855f7' }}>{leads.filter(l => l.status.includes('Meeting')).length}</span>
              </div>
              <div className="ribbon-item">
                <span className="ribbon-label">Negotiating</span>
                <span className="ribbon-value" style={{ color: '#fde047' }}>{leads.filter(l => l.status.includes('Negotiation')).length}</span>
              </div>
              <div className="ribbon-item">
                <span className="ribbon-label">Won</span>
                <span className="ribbon-value" style={{ color: '#4ade80' }}>{leads.filter(l => l.status === 'Won').length}</span>
              </div>
              <div className="ribbon-item">
                <span className="ribbon-label">Lost</span>
                <span className="ribbon-value" style={{ color: '#ef4444' }}>{leads.filter(l => l.status === 'Lost').length}</span>
              </div>
            </div>

            {/* Status Distribution Chart */}
            <section className="distribution-section glass">
              <div className="section-header">
                <h3>Leads by Status</h3>
                <select className="period-select">
                  <option>All Time</option>
                  <option>This Month</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <div className="distribution-chart">
                {['New', 'Contacted', 'Meeting Scheduled', 'Under Negotiation', 'Won', 'Lost'].map(status => {
                  const count = leads.filter(l => l.status === status).length;
                  const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                  let barColor = 'var(--text-muted)';
                  if (status === 'New') barColor = '#60a5fa';
                  if (status === 'Meeting Scheduled') barColor = '#a855f7';
                  if (status === 'Under Negotiation') barColor = '#fde047';
                  if (status === 'Won') barColor = '#4ade80';
                  if (status === 'Lost') barColor = '#ef4444';

                  return (
                    <div key={status} className="chart-row">
                      <div className="chart-label">
                        <span>{status}</span>
                        <span className="chart-count">{count}</span>
                      </div>
                      <div className="chart-track">
                        <div
                          className="chart-bar"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: barColor,
                            minWidth: count > 0 ? '4px' : '0'
                          }}
                        ></div>
                      </div>
                      <span className="chart-percentage">{Math.round(percentage)}%</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Lead Table Section */}
            <section className="table-section glass">
              <div className="section-header">
                <h2>Lead List</h2>
                <div className="table-actions">
                  <input type="text" placeholder="Search businesses..." className="search-input" />
                </div>
              </div>

              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>District</th>
                    <th>Status</th>
                    <th>Meeting Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="table-row-animate">
                      <td><strong>{lead.business}</strong></td>
                      <td>{lead.contact}</td>
                      <td>{lead.location}</td>
                      <td>{lead.district}</td>
                      <td>
                        <select
                          className={`badge-select ${getStatusClass(lead.status)}`}
                          value={lead.status}
                          onChange={(e) => handleStatusChangeRequest(lead.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {lead.meetingDate ? (
                          <div className="meeting-date-cell">
                            <span className={`meeting-date ${new Date(lead.meetingDate) < new Date() ? 'overdue' :
                              new Date(lead.meetingDate).toDateString() === new Date().toDateString() ? 'today' :
                                'upcoming'
                              }`}>
                              {new Date(lead.meetingDate).toLocaleDateString()} {new Date(lead.meetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleEditLead(lead)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteLead(lead.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard

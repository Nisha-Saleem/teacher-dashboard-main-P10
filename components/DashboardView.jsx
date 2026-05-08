import React, { useState, useEffect } from 'react';
import { INITIAL_IDEAS } from '../data';
import '../styles/DashboardView.css';

const DashboardView = () => {
  const [ideas, setIdeas] = useState(INITIAL_IDEAS);
  const pendingIdeas = ideas.filter(i => i.status === 'Pending');
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState('');
  
  // Auto-select first item if none selected or current selection is no longer pending
  useEffect(() => {
    if (pendingIdeas.length > 0) {
      if (!selectedId || !pendingIdeas.find(i => i.id === selectedId)) {
        setSelectedId(pendingIdeas[0].id);
        setFeedback('');
      }
    } else {
      setSelectedId(null);
    }
  }, [pendingIdeas, selectedId]);

  const selectedIdea = pendingIdeas.find(i => i.id === selectedId);

  const onUpdateStatus = (ideaId, newStatus, feedbackText = '') => {
    // Update idea status
    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea.id === ideaId ? { ...idea, status: newStatus } : idea
      )
    );
    
    // Clear feedback and selection
    setFeedback('');
    
    // If accepting, auto-select the next pending idea
    if (newStatus === 'Accepted') {
      const updatedPendingIdeas = ideas.filter(i => i.status === 'Pending' && i.id !== ideaId);
      if (updatedPendingIdeas.length > 0) {
        // Find the next pending idea (first in list)
        const nextPendingIdea = updatedPendingIdeas[0];
        setSelectedId(nextPendingIdea.id);
      } else {
        // No more pending ideas, clear selection
        setSelectedId(null);
      }
    } else if (newStatus === 'Rejected') {
      // If rejecting, auto-select the next pending idea
      const updatedPendingIdeas = ideas.filter(i => i.status === 'Pending' && i.id !== ideaId);
      if (updatedPendingIdeas.length > 0) {
        const nextPendingIdea = updatedPendingIdeas[0];
        setSelectedId(nextPendingIdea.id);
      } else {
        setSelectedId(null);
      }
    }
  };

  
  return (
    <div className="dash-page">
      <div className="dash-header-row">
        <div className="dash-header-text">
          <h2 className="dash-title">Pending Submissions</h2>
          <p className="dash-subtitle">Review new student project proposals requiring your approval.</p>
        </div>

              </div>

      {pendingIdeas.length === 0 ? (
        <div className="dash-empty">
          <span className="material-symbols-outlined dash-empty-icon">check_circle</span>
          <p className="dash-empty-title">All caught up!</p>
          <p className="dash-empty-subtitle">No pending submissions to review.</p>
        </div>
      ) : (
        <div className="dash-main-grid">
          <div className="dash-list-card">
            <div className="dash-list-scroll">
              <table className="dash-table">
                <thead className="dash-table-head">
                  <tr>
                    <th className="dash-th dash-th-idea">Idea Name</th>
                    <th className="dash-th">Description</th>
                    <th className="dash-th dash-th-status">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingIdeas.map((idea) => {
                    const isSelected = selectedId === idea.id;
                    return (
                      <tr
                        key={idea.id}
                        onClick={() => { setSelectedId(idea.id); setFeedback(''); }}
                        className={`dash-tr dash-tr-hover ${isSelected ? 'dash-tr-selected' : ''}`}
                      >
                        <td className="dash-td dash-td-idea">
                          <div className="dash-idea-meta">
                            <span className="dash-idea-title">{idea.title}</span>
                            <span className="dash-idea-submeta">{idea.leader.name} • {idea.session}</span>
                          </div>
                        </td>
                        <td className="dash-td">
                          <p className="dash-idea-desc">{idea.shortDescription}</p>
                        </td>
                        <td className="dash-td">
                          <span className="dash-status-pill dash-status-pill-pending">{idea.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-detail-column">
            {selectedIdea && (
              <div className="dash-detail-card">
                <div className="dash-detail-hero">
                  <div className="dash-detail-avatar-wrapper">
                    <div className="dash-detail-avatar">
                      <span className="material-symbols-outlined">psychology</span>
                    </div>
                  </div>
                </div>

                <div className="dash-detail-body">
                  <div>
                    <div className="dash-detail-title-row">
                      <h3 className="dash-detail-title">{selectedIdea.title}</h3>
                      <span className="dash-session-pill">{selectedIdea.session} Session</span>
                    </div>
                    <p className="dash-detail-leader">
                      Leader: <span className="dash-detail-leader-name">{selectedIdea.leader.name}</span>
                    </p>
                  </div>

                  <div className="dash-detail-section">
                    <h4 className="dash-section-label">Full Description</h4>
                    <div className="dash-detail-description">
                      <p className="dash-section-text">{selectedIdea.fullDescription}</p>
                    </div>
                  </div>

                  <div className="dash-detail-section">
                    <h4 className="dash-section-label">Team Members</h4>
                    <div className="dash-team-list">
                      {selectedIdea.team.length > 0 ? selectedIdea.team.map((member, idx) => (
                        <span key={idx} className="dash-team-pill">
                          <span className="material-symbols-outlined dash-team-pill-icon">person</span>
                          {member.name}
                        </span>
                      )) : (
                        <span className="dash-team-empty">No additional team members</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dash-feedback-section">
                  <h4 className="dash-section-label">Provide Feedback</h4>
                  <label className="dash-feedback-label-wrapper">
                    <span className="dash-feedback-label">
                      Feedback <span className="dash-feedback-label-note">(Required for rejection)</span>
                    </span>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="dash-feedback-input"
                      placeholder="Enter feedback for the students..."
                    ></textarea>
                  </label>
                </div>

                <div className="dash-actions-row">
                  <button
                    onClick={() => onUpdateStatus(selectedIdea.id, 'Rejected', feedback)}
                    className="dash-btn dash-btn-outline dash-btn-reject"
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                    Reject
                  </button>
                  <button
                    onClick={() => onUpdateStatus(selectedIdea.id, 'Accepted')}
                    className="dash-btn dash-btn-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                    Accept
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;

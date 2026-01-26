import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@bcgov/design-system-react-components';
import './ApplicationsListPage.css';

interface Application {
  id: string;
  applicantName: string;
  dateOfBirth: string;
  submittedDate: string;
  program: string;
  status: 'pending' | 'in-review' | 'verified' | 'requires-action';
  completionProgress: number;
  verifiedFactors: number;
  totalFactors: number;
}

const ApplicationsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications] = useState<Application[]>([
    {
      id: 'APP-2026-001',
      applicantName: 'Amina Ahmed',
      dateOfBirth: 'January 01, 1999',
      submittedDate: 'January 12, 2026',
      program: 'Disability Assistance Program',
      status: 'in-review',
      completionProgress: 75,
      verifiedFactors: 2,
      totalFactors: 4
    },
    {
      id: 'APP-2026-002',
      applicantName: 'John Smith',
      dateOfBirth: 'March 15, 1985',
      submittedDate: 'January 15, 2026',
      program: 'Income Assistance Program',
      status: 'pending',
      completionProgress: 0,
      verifiedFactors: 0,
      totalFactors: 4
    },
    {
      id: 'APP-2026-003',
      applicantName: 'Sarah Johnson',
      dateOfBirth: 'July 22, 1992',
      submittedDate: 'January 18, 2026',
      program: 'Disability Assistance Program',
      status: 'requires-action',
      completionProgress: 50,
      verifiedFactors: 1,
      totalFactors: 4
    },
    {
      id: 'APP-2026-004',
      applicantName: 'Michael Chen',
      dateOfBirth: 'November 08, 1978',
      submittedDate: 'January 20, 2026',
      program: 'Disability Assistance Program',
      status: 'verified',
      completionProgress: 100,
      verifiedFactors: 4,
      totalFactors: 4
    }
  ]);

  const handleReviewApplication = (applicationId: string) => {
    // Navigate to case worker dashboard for this specific application
    navigate('/caseworker', { state: { applicationId } });
  };

  return (
    <div className="applications-list-page">
      <header className="page-header">
        <div>
          <h1>Applications Queue</h1>
          <p>Review and manage disability assistance applications</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </header>

      <div className="applications-container">
        <div className="filters-section">
          <div className="filter-stats">
            <div className="stat-item">
              <span className="stat-value">{applications.length}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{applications.filter(a => a.status === 'in-review').length}</span>
              <span className="stat-label">In Review</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{applications.filter(a => a.status === 'requires-action').length}</span>
              <span className="stat-label">Requires Action</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{applications.filter(a => a.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        <div className="applications-grid">
          {applications.map(app => (
            <div key={app.id} className={`application-card ${app.status}`}>
              <div className="card-header">
                <div>
                  <h3>{app.applicantName}</h3>
                  <p className="application-id">{app.id}</p>
                </div>
                <Button 
                  variant="primary" 
                  size="small"
                  className="review-button"
                  onClick={() => handleReviewApplication(app.id)}
                >
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsListPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Callout } from '@bcgov/design-system-react-components';
import './RulesEngineDashboard.css';

interface RuleNode {
  id: string;
  name: string;
  type: 'factor' | 'condition' | 'calculation' | 'decision';
  status: 'active' | 'draft' | 'deprecated';
  lastModified: string;
  description: string;
  dataSource: string;
  dataSourceIds: string[];
  conditions?: RuleCondition[];
  dependencies?: string[];
  version: string;
}

interface RuleCondition {
  id: string;
  field: string;
  operator: string;
  value: string | number;
  description: string;
}

const RulesEngineDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRule, setSelectedRule] = useState<RuleNode | null>(null);

  const [rules] = useState<RuleNode[]>([
    {
      id: 'identity',
      name: 'Identity Confirmation',
      type: 'factor',
      status: 'active',
      lastModified: '2026-02-12',
      version: '1.0',
      description: 'Identity must be verified before other eligibility factors can be assessed',
      dataSource: 'BC Services Card',
      dataSourceIds: ['icbc'],
      conditions: [
        {
          id: 'i1',
          field: 'bcServicesCardVerified',
          operator: '==',
          value: 'true',
          description: 'BC Services Card must be digitally verified'
        },
        {
          id: 'i2',
          field: 'identityMatchConfidence',
          operator: '>=',
          value: 'high',
          description: 'Identity match confidence level must be high or higher'
        }
      ],
      dependencies: ['bc-services-card-authentication']
    },
    {
      id: 'income-verification',
      name: 'Income Within Threshold',
      type: 'condition',
      status: 'active',
      lastModified: '2026-02-12',
      version: '1.0',
      description: 'Verifies that total annual income is below the program threshold',
      dataSource: 'Canada Revenue Agency (CRA) - T1 General',
      dataSourceIds: ['cra'],
      conditions: [
        {
          id: 'c1',
          field: 'totalIncome',
          operator: '<=',
          value: 32760,
          description: 'Total annual income must be at or below 130% of federal poverty line for household size'
        },
        {
          id: 'c2',
          field: 'householdSize',
          operator: '>=',
          value: 1,
          description: 'Household must contain at least one person'
        }
      ],
      dependencies: ['household-composition', 'income-calculation']
    },
    {
      id: 'residency-check',
      name: 'BC Residency Verification',
      type: 'factor',
      status: 'active',
      lastModified: '2026-02-12',
      version: '1.0',
      description: 'Confirms British Columbia residency through multi-source verification',
      dataSource: 'Multiple sources (ICBC, MSP, BC Hydro, CRA)',
      dataSourceIds: ['icbc', 'msp', 'bc-hydro', 'cra'],
      conditions: [
        {
          id: 'r1',
          field: 'addressMatchCount',
          operator: '>=',
          value: 3,
          description: 'At least 3 authoritative sources must confirm BC address'
        },
        {
          id: 'r2',
          field: 'residencyDuration',
          operator: '>=',
          value: 90,
          description: 'Must have resided in BC for at least 90 consecutive days'
        }
      ],
      dependencies: ['data-source-aggregation']
    }
  ]);

  const getRuleTypeColor = (type: RuleNode['type']) => {
    switch (type) {
      case 'factor': return 'badge-primary';
      case 'condition': return 'badge-info';
      case 'calculation': return 'badge-warning';
      case 'decision': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  const getStatusColor = (status: RuleNode['status']) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'draft': return 'badge-warning';
      case 'deprecated': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const renderRulesView = () => (
    <div className="rules-view">
      <div className="view-header">
        <div>
          <h2>Eligibility Factors</h2>
          <p>Browse and manage eligibility verification factors</p>
        </div>
        <Button variant="primary">+ Create New Factor</Button>
      </div>

      <div className="rules-grid">
        {rules.map(rule => (
          <div 
            key={rule.id} 
            className={`rule-card ${selectedRule?.id === rule.id ? 'selected' : ''}`}
            onClick={() => setSelectedRule(rule)}
          >
            <div className="rule-header">
              <h3>{rule.name}</h3>
              <div className="badges">
                <span className={`badge ${getRuleTypeColor(rule.type)}`}>{rule.type}</span>
                <span className={`badge ${getStatusColor(rule.status)}`}>{rule.status}</span>
              </div>
            </div>
            <p className="rule-description">{rule.description}</p>
            <div className="rule-meta">
              <div className="meta-item">
                <span className="meta-label">Version:</span>
                <span className="meta-value">{rule.version}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Modified:</span>
                <span className="meta-value">{rule.lastModified}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Data Source:</span>
                <span className="meta-value">{rule.dataSource}</span>
              </div>
              <div className="meta-item source-link">
                <button
                  className="view-source-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/data-sources`);
                  }}
                >
                  View Source Profile →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRule && (
        <div className="rule-detail">
          <div className="detail-header">
            <h2>{selectedRule.name}</h2>
            <div className="detail-actions">
              <Button variant="secondary">Edit Factor</Button>
              <Button variant="secondary">View History</Button>
              <Button variant="secondary">Test Factor</Button>
            </div>
          </div>

          <div className="detail-section">
            <h3>Conditions</h3>
            {selectedRule.conditions && selectedRule.conditions.length > 0 ? (
              <div className="conditions-list">
                {selectedRule.conditions.map(condition => (
                  <div key={condition.id} className="condition-item">
                    <code className="condition-code">
                      {condition.field} {condition.operator} {condition.value}
                    </code>
                    <p className="condition-description">{condition.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No conditions defined</p>
            )}
          </div>

          {selectedRule.dependencies && selectedRule.dependencies.length > 0 && (
            <div className="detail-section">
              <h3>Dependencies</h3>
              <div className="dependencies-list">
                {selectedRule.dependencies.map(dep => (
                  <span key={dep} className="badge badge-secondary">{dep}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="rules-engine-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Eligibility Factor Management & Transparency</h1>
          <p>Manage and understand eligibility verification factors</p>
        </div>
      </header>

      <Callout variant="lightGold">
        This interface provides transparency into eligibility factors,
        showing how determinations are made with clear logic, data sources, and version control.
        Each factor is independently managed and testable.
      </Callout>

      <div className="view-content">
        {renderRulesView()}
      </div>
    </div>
  );
};

export default RulesEngineDashboard;

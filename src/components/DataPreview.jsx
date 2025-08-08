import { useState } from 'react'
import { Database, Eye, BarChart3, AlertTriangle } from 'lucide-react'

const DataPreview = ({ data, onProceed }) => {
  const [activeTab, setActiveTab] = useState('summary')

  const formatNumber = (num) => {
    if (typeof num === 'number') {
      return num.toLocaleString()
    }
    return num
  }

  const getDataTypeColor = (dtype) => {
    if (dtype.includes('int') || dtype.includes('float')) return 'numeric'
    if (dtype.includes('datetime')) return 'datetime'
    return 'categorical'
  }

  return (
    <div className="data-preview">
      <div className="preview-header">
        <h2>Data Preview</h2>
        <p>File: {data.filename}</p>
      </div>

      <div className="preview-tabs">
        <button
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <Database className="tab-icon" />
          Summary
        </button>
        <button
          className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          <Eye className="tab-icon" />
          Preview
        </button>
        <button
          className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          <AlertTriangle className="tab-icon" />
          Issues
        </button>
      </div>

      <div className="preview-content">
        {activeTab === 'summary' && (
          <div className="summary-tab">
            <div className="summary-grid">
              <div className="summary-card">
                <h3>Dataset Info</h3>
                <div className="summary-item">
                  <span>Rows:</span>
                  <span>{formatNumber(data.shape[0])}</span>
                </div>
                <div className="summary-item">
                  <span>Columns:</span>
                  <span>{formatNumber(data.shape[1])}</span>
                </div>
                <div className="summary-item">
                  <span>File Size:</span>
                  <span>{data.file?.size ? `${(data.file.size / 1024).toFixed(1)} KB` : 'N/A'}</span>
                </div>
              </div>

              <div className="summary-card">
                <h3>Data Types</h3>
                <div className="data-types">
                  {Object.entries(data.data_types).map(([col, dtype]) => (
                    <div key={col} className={`data-type-item ${getDataTypeColor(dtype)}`}>
                      <span className="column-name">{col}</span>
                      <span className="data-type">{dtype}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-card">
                <h3>Missing Values</h3>
                <div className="missing-values">
                  {Object.entries(data.missing_values).map(([col, count]) => (
                    <div key={col} className="missing-item">
                      <span className="column-name">{col}</span>
                      <span className="missing-count">{formatNumber(count)}</span>
                      <div className="missing-bar">
                        <div
                          className="missing-fill"
                          style={{ width: `${(count / data.shape[0]) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="preview-tab">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {data.columns?.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.preview.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {data.columns?.map((col, colIndex) => (
                        <td key={colIndex} className={getDataTypeColor(data.data_types[col])}>
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : 'null'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="preview-note">Showing first 5 rows of {formatNumber(data.shape[0])} total rows</p>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="issues-tab">
            <div className="issues-summary">
              <h3>Potential Data Issues</h3>

              <div className="issue-cards">
                {Object.entries(data.missing_values).some(([_, count]) => count > 0) && (
                  <div className="issue-card warning">
                    <AlertTriangle className="issue-icon" />
                    <div className="issue-content">
                      <h4>Missing Values</h4>
                      <p>Some columns contain missing values that may need attention</p>
                      <ul>
                        {Object.entries(data.missing_values)
                          .filter(([_, count]) => count > 0)
                          .map(([col, count]) => (
                            <li key={col}>{col}: {formatNumber(count)} missing values</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="issue-card info">
                  <BarChart3 className="issue-icon" />
                  <div className="issue-content">
                    <h4>Data Types</h4>
                    <p>Consider converting data types for better analysis</p>
                    <ul>
                      {Object.entries(data.data_types).map(([col, dtype]) => (
                        <li key={col}>{col}: {dtype}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="preview-actions">
        <button className="btn-primary" onClick={onProceed}>
          Continue to Cleaning
        </button>
      </div>
    </div>
  )
}

export default DataPreview 
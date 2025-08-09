import { useState } from 'react'
import { Settings, TrendingUp, BarChart3, Download } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const TransformationPanel = ({ data, setLoading, setError }) => {
  const [selectedColumns, setSelectedColumns] = useState([])
  const [transformationType, setTransformationType] = useState('normalize')
  const [transformationResult, setTransformationResult] = useState(null)

  // Safety check for data
  if (!data || !data.columns) {
    return (
      <div className="transformation-panel">
        <div className="transform-header">
          <h2>Data Transformation</h2>
          <p>No data available for transformation</p>
        </div>
      </div>
    )
  }

  const transformationTypes = [
    {
      id: 'normalize',
      label: 'Normalize (Min-Max)',
      description: 'Scale data to range [0, 1]',
      icon: TrendingUp
    },
    {
      id: 'standardize',
      label: 'Standardize (Z-Score)',
      description: 'Scale data to mean=0, std=1',
      icon: BarChart3
    },
    {
      id: 'log',
      label: 'Log Transform',
      description: 'Apply natural logarithm',
      icon: Settings
    },
    {
      id: 'sqrt',
      label: 'Square Root Transform',
      description: 'Apply square root transformation',
      icon: TrendingUp
    },
    {
      id: 'scale',
      label: 'Custom Scale',
      description: 'Scale to custom range',
      icon: BarChart3
    }
  ]

  const numericColumns = (data.columns || []).filter(col => {
    const dtype = data.data_types?.[col]
    return dtype && (dtype.includes('int') || dtype.includes('float') || dtype.includes('number'))
  })

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    )
  }

  const handleSelectAll = () => {
    setSelectedColumns(numericColumns)
  }

  const handleClearAll = () => {
    setSelectedColumns([])
  }

  const handleTransform = async () => {
    if (selectedColumns.length === 0) {
      setError('Please select at least one column to transform')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/transform`, {
        file_id: data.file_id,
        columns: selectedColumns,
        transformation_type: transformationType,
        params: transformationType === 'scale' ? { feature_range: [0, 1] } : null
      })

      setTransformationResult(response.data)
    } catch (error) {
      console.error('Transformation error:', error)
      const errorMessage = error.response?.data?.detail
        ? (Array.isArray(error.response.data.detail)
          ? error.response.data.detail[0]?.msg || 'Failed to transform data'
          : error.response.data.detail)
        : 'Failed to transform data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download/${data.file_id}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `transformed_${data.filename}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      setError('Failed to download transformed data')
    }
  }

  return (
    <div className="transformation-panel">
      <div className="transform-header">
        <h2>Data Transformation</h2>
        <p>Apply mathematical transformations to your data</p>
      </div>

      <div className="transform-content">
        <div className="transform-controls">
          <div className="control-section">
            <h3>Transformation Type</h3>
            <div className="transform-type-grid">
              {transformationTypes.map(transform => {
                const Icon = transform.icon
                return (
                  <button
                    key={transform.id}
                    className={`transform-type-button ${transformationType === transform.id ? 'active' : ''}`}
                    onClick={() => setTransformationType(transform.id)}
                  >
                    <Icon className="transform-icon" />
                    <span className="transform-label">{transform.label}</span>
                    <span className="transform-description">{transform.description}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="control-section">
            <h3>Select Columns</h3>
            <div className="column-selection">
              <div className="selection-actions">
                <button className="btn-secondary" onClick={handleSelectAll}>
                  Select All Numeric
                </button>
                <button className="btn-secondary" onClick={handleClearAll}>
                  Clear All
                </button>
              </div>

              <div className="column-grid">
                {numericColumns.length > 0 ? numericColumns.map(col => (
                  <label key={col} className="column-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col)}
                      onChange={() => handleColumnToggle(col)}
                    />
                    <span className="column-name">{col}</span>
                    <span className="column-type">{data.data_types?.[col] || 'unknown'}</span>
                  </label>
                )) : (
                  // Fallback: show all columns if no numeric columns detected
                  (data.columns || []).map(col => (
                    <label key={col} className="column-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(col)}
                        onChange={() => handleColumnToggle(col)}
                      />
                      <span className="column-name">{col}</span>
                      <span className="column-type">{data.data_types?.[col] || 'unknown'}</span>
                    </label>
                  ))
                )}
              </div>

              {numericColumns.length === 0 && (data.columns || []).length > 0 && (
                <p className="no-numeric-warning">
                  No numeric columns automatically detected. All columns are shown - select carefully as transformations work best on numeric data.
                </p>
              )}
            </div>
          </div>

          <div className="control-section">
            <h3>Transformation Info</h3>
            <div className="transform-info">
              {transformationType === 'normalize' && (
                <div className="info-card">
                  <h4>Min-Max Normalization</h4>
                  <p>Scales data to a fixed range [0, 1] using the formula:</p>
                  <code>x_normalized = (x - x_min) / (x_max - x_min)</code>
                  <p>Useful for algorithms that are sensitive to the scale of input features.</p>
                </div>
              )}

              {transformationType === 'standardize' && (
                <div className="info-card">
                  <h4>Z-Score Standardization</h4>
                  <p>Scales data to have mean=0 and standard deviation=1:</p>
                  <code>x_standardized = (x - μ) / σ</code>
                  <p>Useful for algorithms that assume normally distributed features.</p>
                </div>
              )}

              {transformationType === 'log' && (
                <div className="info-card">
                  <h4>Logarithmic Transformation</h4>
                  <p>Applies natural logarithm to reduce skewness:</p>
                  <code>x_log = ln(x + shift)</code>
                  <p>Useful for right-skewed data and multiplicative relationships.</p>
                </div>
              )}

              {transformationType === 'sqrt' && (
                <div className="info-card">
                  <h4>Square Root Transformation</h4>
                  <p>Applies square root to reduce right skewness:</p>
                  <code>x_sqrt = sqrt(x + shift)</code>
                  <p>Useful for count data and reducing variance.</p>
                </div>
              )}

              {transformationType === 'scale' && (
                <div className="info-card">
                  <h4>Custom Scaling</h4>
                  <p>Scales data to custom range using Min-Max scaling:</p>
                  <code>x_scaled = (x - x_min) / (x_max - x_min) * (max - min) + min</code>
                  <p>Useful when you need specific value ranges.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {transformationResult && (
          <div className="transform-results">
            <h3>Transformation Results</h3>

            <div className="results-summary">
              <div className="result-item">
                <span>Transformation applied:</span>
                <span>{transformationType}</span>
              </div>
              <div className="result-item">
                <span>Columns transformed:</span>
                <span>{selectedColumns.length}</span>
              </div>
              <div className="result-item">
                <span>Columns:</span>
                <span>{selectedColumns.join(', ')}</span>
              </div>
            </div>

            <div className="preview-table">
              <h4>Data Preview (First 5 rows)</h4>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(transformationResult.preview[0] || {}).map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transformationResult.preview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>
                            {typeof value === 'number' ? value.toFixed(4) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="transform-actions">
              <button className="btn-secondary" onClick={handleDownload}>
                <Download className="btn-icon" />
                Download Transformed Data
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="transform-actions">
        <button
          className="btn-primary"
          onClick={handleTransform}
          disabled={selectedColumns.length === 0}
        >
          <Settings className="btn-icon" />
          Apply Transformation
        </button>
      </div>
    </div>
  )
}

export default TransformationPanel 
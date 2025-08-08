import { useState } from 'react'
import { Settings, CheckCircle, AlertCircle, Download } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const CleaningOptions = ({ data, onDataClean, setLoading, setError }) => {
  const [cleaningOptions, setCleaningOptions] = useState({
    fill_missing: true,
    drop_duplicates: true,
    standardize_columns: true,
    fix_datatypes: true,
    handle_outliers: true,
    strip_whitespace: true,
    fix_dates: true,
    remove_constant_columns: true,
    outlier_threshold: 3.0
  })

  const [cleaningResult, setCleaningResult] = useState(null)

  const handleOptionChange = (option, value) => {
    setCleaningOptions(prev => ({
      ...prev,
      [option]: value
    }))
  }

  const handleCleanData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/clean`, {
        file_id: data.file_id,
        ...cleaningOptions
      })

      setCleaningResult(response.data)
      onDataClean(response.data)
    } catch (error) {
      console.error('Cleaning error:', error)
      const errorMessage = error.response?.data?.detail
        ? (Array.isArray(error.response.data.detail)
          ? error.response.data.detail[0]?.msg || 'Failed to clean data'
          : error.response.data.detail)
        : 'Failed to clean data'
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
      link.setAttribute('download', `cleaned_${data.filename}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      setError('Failed to download cleaned data')
    }
  }

  return (
    <div className="cleaning-options">
      <div className="cleaning-header">
        <h2>Data Cleaning Options</h2>
        <p>Configure how you want to clean your data</p>
      </div>

      <div className="cleaning-content">
        <div className="options-panel">
          <h3>Cleaning Operations</h3>

          <div className="options-grid">
            <div className="option-group">
              <h4>Basic Cleaning</h4>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.fill_missing}
                  onChange={(e) => handleOptionChange('fill_missing', e.target.checked)}
                />
                <span>Fill missing values</span>
                <p>Replace missing values with appropriate defaults</p>
              </label>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.drop_duplicates}
                  onChange={(e) => handleOptionChange('drop_duplicates', e.target.checked)}
                />
                <span>Remove duplicates</span>
                <p>Remove duplicate rows from the dataset</p>
              </label>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.strip_whitespace}
                  onChange={(e) => handleOptionChange('strip_whitespace', e.target.checked)}
                />
                <span>Strip whitespace</span>
                <p>Remove leading and trailing whitespace from text columns</p>
              </label>
            </div>

            <div className="option-group">
              <h4>Data Structure</h4>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.standardize_columns}
                  onChange={(e) => handleOptionChange('standardize_columns', e.target.checked)}
                />
                <span>Standardize column names</span>
                <p>Convert column names to snake_case format</p>
              </label>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.fix_datatypes}
                  onChange={(e) => handleOptionChange('fix_datatypes', e.target.checked)}
                />
                <span>Fix data types</span>
                <p>Automatically detect and convert data types</p>
              </label>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.fix_dates}
                  onChange={(e) => handleOptionChange('fix_dates', e.target.checked)}
                />
                <span>Parse dates</span>
                <p>Convert date-like strings to proper datetime format</p>
              </label>
            </div>

            <div className="option-group">
              <h4>Advanced Cleaning</h4>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.handle_outliers}
                  onChange={(e) => handleOptionChange('handle_outliers', e.target.checked)}
                />
                <span>Handle outliers</span>
                <p>Detect and handle statistical outliers</p>
              </label>

              <label className="option-item">
                <input
                  type="checkbox"
                  checked={cleaningOptions.remove_constant_columns}
                  onChange={(e) => handleOptionChange('remove_constant_columns', e.target.checked)}
                />
                <span>Remove constant columns</span>
                <p>Remove columns with no variation in values</p>
              </label>

              <div className="option-item">
                <label>
                  <span>Outlier threshold:</span>
                  <input
                    type="number"
                    value={cleaningOptions.outlier_threshold}
                    onChange={(e) => handleOptionChange('outlier_threshold', parseFloat(e.target.value))}
                    min="1"
                    max="10"
                    step="0.1"
                  />
                </label>
                <p>Z-score threshold for outlier detection (default: 3.0)</p>
              </div>
            </div>
          </div>
        </div>

        {cleaningResult && (
          <div className="cleaning-results">
            <h3>Cleaning Results</h3>

            <div className="results-grid">
              <div className="result-card">
                <h4>Dataset Changes</h4>
                <div className="result-item">
                  <span>Original shape:</span>
                  <span>{cleaningResult.original_shape[0]} × {cleaningResult.original_shape[1]}</span>
                </div>
                <div className="result-item">
                  <span>Cleaned shape:</span>
                  <span>{cleaningResult.cleaned_shape[0]} × {cleaningResult.cleaned_shape[1]}</span>
                </div>
                <div className="result-item">
                  <span>Rows removed:</span>
                  <span>{cleaningResult.original_shape[0] - cleaningResult.cleaned_shape[0]}</span>
                </div>
              </div>

              <div className="result-card">
                <h4>Missing Values</h4>
                <div className="missing-comparison">
                  {Object.keys(cleaningResult.missing_values_after).map(col => {
                    const before = cleaningResult.missing_values_before[col] || 0
                    const after = cleaningResult.missing_values_after[col] || 0
                    const improvement = before - after

                    return (
                      <div key={col} className="missing-comparison-item">
                        <span className="column-name">{col}</span>
                        <span className="missing-before">{before}</span>
                        <span className="missing-after">{after}</span>
                        {improvement > 0 && (
                          <span className="improvement">-{improvement}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="cleaning-actions">
              <button className="btn-secondary" onClick={handleDownload}>
                <Download className="btn-icon" />
                Download Cleaned Data
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="cleaning-actions">
        <button
          className="btn-primary"
          onClick={handleCleanData}
          disabled={!Object.values(cleaningOptions).some(option => option === true)}
        >
          <Settings className="btn-icon" />
          Clean Data
        </button>
      </div>
    </div>
  )
}

export default CleaningOptions 
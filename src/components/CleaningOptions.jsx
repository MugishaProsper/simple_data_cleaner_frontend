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
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 tracking-tight">Data Cleaning Options</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">Configure how you want to clean your data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary-500" />
            Cleaning Operations
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Basic Cleaning</h4>
              <div className="space-y-4">

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.fill_missing}
                    onChange={(e) => handleOptionChange('fill_missing', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Fill missing values</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Replace missing values with appropriate defaults</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.drop_duplicates}
                    onChange={(e) => handleOptionChange('drop_duplicates', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Remove duplicates</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Remove duplicate rows from the dataset</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.strip_whitespace}
                    onChange={(e) => handleOptionChange('strip_whitespace', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Strip whitespace</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Remove leading and trailing whitespace from text columns</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Data Structure</h4>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.standardize_columns}
                    onChange={(e) => handleOptionChange('standardize_columns', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Standardize column names</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Convert column names to snake_case format</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.fix_datatypes}
                    onChange={(e) => handleOptionChange('fix_datatypes', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Fix data types</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Automatically detect and convert data types</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.fix_dates}
                    onChange={(e) => handleOptionChange('fix_dates', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Parse dates</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Convert date-like strings to proper datetime format</p>
                  </div>
                </label>
              </div>
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

      <div className="flex justify-center">
        <button
          className="btn-primary"
          onClick={handleCleanData}
          disabled={!Object.values(cleaningOptions).some(option => option === true)}
        >
          <Settings className="w-4 h-4" />
          Clean Data
        </button>
      </div>
    </div>
  )
}

export default CleaningOptions 
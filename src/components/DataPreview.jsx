import { useState } from 'react'
import { Database, ChevronLeft, ChevronRight, BarChart3, AlertCircle } from 'lucide-react'

const DataPreview = ({ data, onProceed }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const rowsPerPage = 10

  // Safety check for data
  if (!data || !data.preview || !Array.isArray(data.preview)) {
    return (
      <div className="data-preview">
        <div className="preview-header">
          <h2>Data Preview</h2>
          <p>No data available to preview</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(data.preview.length / rowsPerPage)
  const startIndex = currentPage * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = data.preview.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
  }

  // Get column statistics
  const getColumnStats = (column) => {
    const values = data.preview.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '')
    const nonNullCount = values.length
    const totalCount = data.preview.length
    const missingCount = totalCount - nonNullCount
    const missingPercentage = ((missingCount / totalCount) * 100).toFixed(1)

    return {
      nonNullCount,
      totalCount,
      missingCount,
      missingPercentage,
      uniqueCount: new Set(values).size
    }
  }

  return (
    <div className="data-preview">
      <div className="preview-header">
        <h2>Data Preview</h2>
        <p>Review your uploaded data before cleaning</p>
      </div>

      <div className="preview-content">
        <div className="data-summary">
          <h3>Dataset Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">File:</span>
              <span className="summary-value">{data.filename}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Rows:</span>
              <span className="summary-value">{data.shape[0].toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Columns:</span>
              <span className="summary-value">{data.shape[1]}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">File ID:</span>
              <span className="summary-value">{data.file_id}</span>
            </div>
          </div>
        </div>

        <div className="column-analysis">
          <h3>Column Analysis</h3>
          <div className="column-grid">
            {data.columns.map(column => {
              const stats = getColumnStats(column)
              const dataType = data.data_types?.[column] || 'unknown'
              const missingCount = data.missing_values?.[column] || 0

              return (
                <div key={column} className="column-card">
                  <div className="column-header">
                    <h4 className="column-name">{column}</h4>
                    <span className={`column-type ${dataType.includes('int') || dataType.includes('float') ? 'numeric' : 'categorical'}`}>
                      {dataType}
                    </span>
                  </div>
                  <div className="column-stats">
                    <div className="stat-item">
                      <span>Unique values:</span>
                      <span>{stats.uniqueCount}</span>
                    </div>
                    <div className="stat-item">
                      <span>Missing values:</span>
                      <span className={missingCount > 0 ? 'missing-values' : ''}>{missingCount}</span>
                    </div>
                    {missingCount > 0 && (
                      <div className="stat-item">
                        <span>Missing %:</span>
                        <span className="missing-percentage">{((missingCount / data.shape[0]) * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="data-table-section">
          <div className="table-header">
            <h3>Data Sample</h3>
            <div className="pagination-info">
              Showing rows {startIndex + 1}-{Math.min(endIndex, data.preview.length)} of {data.preview.length}
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="row-number-header">#</th>
                  {data.columns.map(column => (
                    <th key={column} className="column-header">
                      <div className="column-header-content">
                        <span className="column-name">{column}</span>
                        <span className="column-type">{data.data_types?.[column] || 'unknown'}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr key={startIndex + index}>
                    <td className="row-number">{startIndex + index + 1}</td>
                    {data.columns.map(column => {
                      const value = row[column]
                      const isNull = value === null || value === undefined || value === ''

                      return (
                        <td key={column} className={`data-cell ${isNull ? 'null-value' : ''}`}>
                          {isNull ? (
                            <span className="null-indicator">NULL</span>
                          ) : (
                            String(value)
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="table-pagination">
              <button
                className="pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="btn-icon" />
                Previous
              </button>

              <span className="pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="btn-icon" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="preview-actions">
        <button className="btn-primary" onClick={onProceed}>
          <BarChart3 className="btn-icon" />
          Proceed to Data Cleaning
        </button>
      </div>
    </div>
  )
}

export default DataPreview 
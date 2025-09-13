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
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 tracking-tight">Data Preview</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">Review your uploaded data before cleaning</p>
      </div>

      <div className="space-y-8">
        <div className="card p-8">
          <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            <Database className="w-6 h-6 text-primary-500" />
            Dataset Summary
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-hover p-6">
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">File Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">File:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold font-mono">{data.filename}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">File ID:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold font-mono">{data.file_id}</span>
                </div>
              </div>
            </div>
            <div className="card-hover p-6">
              <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Dataset Dimensions</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Rows:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold font-mono">{data.shape[0].toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Columns:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold font-mono">{data.shape[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            <BarChart3 className="w-6 h-6 text-primary-500" />
            Column Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.columns.map(column => {
              const stats = getColumnStats(column)
              const dataType = data.data_types?.[column] || 'unknown'
              const missingCount = data.missing_values?.[column] || 0
              const isNumeric = dataType.includes('int') || dataType.includes('float')
              const missingPercentage = (missingCount / data.shape[0]) * 100

              return (
                <div key={column} className={`card-hover p-4 ${isNumeric ? 'border-l-4 border-l-primary-500' : 'border-l-4 border-l-amber-500'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">{column}</h4>
                    <span className={isNumeric ? 'badge-numeric' : 'badge-categorical'}>
                      {dataType}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Unique values:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold font-mono">{stats.uniqueCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Missing values:</span>
                      <span className={`font-semibold font-mono ${missingCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {missingCount.toLocaleString()}
                      </span>
                    </div>
                    {missingCount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Missing %:</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono">{missingPercentage.toFixed(1)}%</span>
                      </div>
                    )}
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300 rounded-full" 
                        style={{ width: `${missingPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
              <Database className="w-6 h-6 text-primary-500" />
              Data Sample
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              Showing rows {startIndex + 1}-{Math.min(endIndex, data.preview.length)} of {data.preview.length.toLocaleString()}
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-16 text-center bg-gray-200 dark:bg-gray-600">#</th>
                  {data.columns.map(column => (
                    <th key={column} className="min-w-[120px]">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{column}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal uppercase tracking-wide">
                          {data.data_types?.[column] || 'unknown'}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr key={startIndex + index}>
                    <td className="text-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium font-mono text-xs sticky left-0 z-10">
                      {startIndex + index + 1}
                    </td>
                    {data.columns.map(column => {
                      const value = row[column]
                      const isNull = value === null || value === undefined || value === ''
                      const dataType = data.data_types?.[column] || 'unknown'
                      const isNumeric = dataType.includes('int') || dataType.includes('float')

                      return (
                        <td key={column} className={`${isNumeric ? 'numeric' : isNumeric ? 'datetime' : 'categorical'}`}>
                          {isNull ? (
                            <span className="null-indicator">NULL</span>
                          ) : (
                            <span className="block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={String(value)}>
                              {String(value)}
                            </span>
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
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button className="btn-primary" onClick={onProceed}>
          <BarChart3 className="w-4 h-4" />
          Proceed to Data Cleaning
        </button>
      </div>
    </div>
  )
}

export default DataPreview 
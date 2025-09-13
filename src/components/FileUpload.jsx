import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, CheckCircle, Database } from 'lucide-react'
import axios from 'axios'
import SkeletonLoader from './SkeletonLoader'

const API_BASE_URL = 'http://localhost:8000'

const FileUpload = ({ onFileUpload, setLoading, setError }) => {
  const [uploadStatus, setUploadStatus] = useState('idle')

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setLoading(true)
    setUploadStatus('uploading')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadStatus('success')
      onFileUpload({
        ...response.data,
        file: file
      })
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error.response?.data?.detail
        ? (Array.isArray(error.response.data.detail)
          ? error.response.data.detail[0]?.msg || 'Failed to upload file'
          : error.response.data.detail)
        : 'Failed to upload file'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [onFileUpload, setLoading, setError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  })

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex flex-col gap-8">
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
            bg-white dark:bg-gray-800 shadow-sm
            ${isDragActive 
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 -translate-y-1 shadow-lg' 
              : uploadStatus === 'uploading'
              ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 animate-pulse-slow'
              : uploadStatus === 'success'
              ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
              : uploadStatus === 'error'
              ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-1 hover:shadow-lg'
            }
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4 relative z-10">
            {uploadStatus === 'idle' && (
              <>
                <div className="transition-all duration-300 hover:scale-110">
                  <Upload className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Upload your CSV file</h3>
                  <p className="text-gray-600 dark:text-gray-400">Drag and drop your CSV file here, or click to browse</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Supported formats: CSV files only
                  </p>
                </div>
              </>
            )}

            {uploadStatus === 'uploading' && (
              <>
                <div className="loading-spinner mb-4" aria-hidden="true"></div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Uploading...</h3>
                  <p className="text-gray-600 dark:text-gray-400">Please wait while we process your file</p>
                </div>
              </>
            )}

            {uploadStatus === 'success' && (
              <>
                <div className="animate-pulse">
                  <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">File uploaded successfully!</h3>
                  <p className="text-green-600 dark:text-green-400">Your data is ready for preview and cleaning</p>
                </div>
              </>
            )}

            {uploadStatus === 'error' && (
              <>
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Upload failed</h3>
                  <p className="text-red-600 dark:text-red-400">Please try again with a valid CSV file</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card p-6 hover:-translate-y-1 transition-all duration-300">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-500" />
            What happens next?
          </h4>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>We'll analyze your data structure</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Show you a preview of your data</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Identify potential cleaning opportunities</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Help you visualize and transform your data</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FileUpload 
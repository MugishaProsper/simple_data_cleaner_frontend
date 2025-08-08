import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import axios from 'axios'

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
    <div className="file-upload">
      <div className="upload-container">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${uploadStatus}`}
        >
          <input {...getInputProps()} />

          <div className="upload-content">
            <Upload className="upload-icon" />

            {uploadStatus === 'idle' && (
              <>
                <h3>Upload your CSV file</h3>
                <p>Drag and drop your CSV file here, or click to browse</p>
                <p className="upload-hint">
                  Supported formats: CSV files only
                </p>
              </>
            )}

            {uploadStatus === 'uploading' && (
              <>
                <div className="upload-spinner"></div>
                <h3>Uploading...</h3>
                <p>Please wait while we process your file</p>
              </>
            )}

            {uploadStatus === 'success' && (
              <>
                <FileText className="success-icon" />
                <h3>File uploaded successfully!</h3>
                <p>Your data is ready for preview and cleaning</p>
              </>
            )}

            {uploadStatus === 'error' && (
              <>
                <AlertCircle className="error-icon" />
                <h3>Upload failed</h3>
                <p>Please try again with a valid CSV file</p>
              </>
            )}
          </div>
        </div>

        <div className="upload-info">
          <h4>What happens next?</h4>
          <ul>
            <li>We'll analyze your data structure</li>
            <li>Show you a preview of your data</li>
            <li>Identify potential cleaning opportunities</li>
            <li>Help you visualize and transform your data</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FileUpload 
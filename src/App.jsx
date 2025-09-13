import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import CleaningOptions from './components/CleaningOptions'
import VisualizationPanel from './components/VisualizationPanel'
import TransformationPanel from './components/TransformationPanel'
import { Upload, Database, BarChart3, Settings, Download } from 'lucide-react'

function App() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [fileData, setFileData] = useState(null)
  const [cleanedData, setCleanedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);

  const getCurrentYear = () => {
    return new Date().getFullYear()
  }

  const steps = [
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'preview', label: 'Data Preview', icon: Database },
    { id: 'clean', label: 'Clean Data', icon: Settings },
    { id: 'visualize', label: 'Visualize', icon: BarChart3 },
    { id: 'transform', label: 'Transform', icon: Settings }
  ]

  const handleFileUpload = (data) => {
    setFileData(data)
    setCurrentStep('preview')
    setError(null)
  }

  const handleDataClean = (cleanedData) => {
    setCleanedData(cleanedData)
    setCurrentStep('visualize')
  }

  const handleStepChange = (step) => {
    if (step === 'upload' || (fileData && step === 'preview') ||
      (cleanedData && ['visualize', 'transform'].includes(step))) {
      setCurrentStep(step)
    }
  }

  return (
    <div className="app">
      <header className="header" role="banner">
        <div className="header-content">
          <h1 className="app-title">
            <Database className="app-icon" aria-hidden="true" />
            Simple Data Cleaner
          </h1>
          <p className="app-subtitle">Upload, clean, visualize, and transform your data</p>
        </div>
      </header>

      <nav className="step-navigation" role="navigation" aria-label="Data processing steps">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = (fileData && step.id === 'preview') ||
            (cleanedData && ['visualize', 'transform'].includes(step.id))

          return (
            <button
              key={step.id}
              className={`step-button ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => handleStepChange(step.id)}
              disabled={!isCompleted && step.id !== 'upload'}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${step.label}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}`}
            >
              <Icon className="step-icon" aria-hidden="true" />
              <span className="step-label">{step.label}</span>
              {index < steps.length - 1 && <div className="step-connector" aria-hidden="true" />}
            </button>
          )
        })}
      </nav>

      <main className="main-content" role="main">
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            <p>{error}</p>
            <button onClick={() => setError(null)} aria-label="Dismiss error message">
              Dismiss
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p>Processing...</p>
          </div>
        )}

        {currentStep === 'upload' && (
          <FileUpload
            onFileUpload={handleFileUpload}
            setLoading={setLoading}
            setError={setError}
          />
        )}

        {currentStep === 'preview' && fileData && (
          <DataPreview
            data={fileData}
            onProceed={() => setCurrentStep('clean')}
          />
        )}

        {currentStep === 'clean' && fileData && (
          <CleaningOptions
            data={fileData}
            onDataClean={handleDataClean}
            setLoading={setLoading}
            setError={setError}
          />
        )}

        {currentStep === 'visualize' && cleanedData && (
          <VisualizationPanel
            data={cleanedData}
            setLoading={setLoading}
            setError={setError}
          />
        )}

        {currentStep === 'transform' && cleanedData && (
          <TransformationPanel
            data={cleanedData}
            setLoading={setLoading}
            setError={setError}
          />
        )}
      </main>

      <footer className="footer" role="contentinfo">
        <p>&copy; {getCurrentYear()} Simple Data Cleaner. Built with React and FastAPI by Mugisha Prosper.</p>
        <p>Contact Support: <a href="mailto:nelsonprox92@gmail.com">nelsonprox92@gmail.com</a></p>
        <p>Check out our <a href="https://github.com/MugishaProsper/simple_data_cleaner_frontend">GitHub repository</a> for the source code and contribute to the project.</p>
        <p>License: <a href="https://github.com/simpledatacleaner/simple-data-cleaner/blob/main/LICENSE">MIT License</a></p>
      </footer>
    </div>
  )
}

export default App 
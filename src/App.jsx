import { useState } from 'react'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import CleaningOptions from './components/CleaningOptions'
import VisualizationPanel from './components/VisualizationPanel'
import TransformationPanel from './components/TransformationPanel'
import ThemeToggle from './components/ThemeToggle'
import { Upload, Database, BarChart3, Settings, Download } from 'lucide-react'

function App() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [fileData, setFileData] = useState(null)
  const [cleanedData, setCleanedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-purple-600 text-white py-12 shadow-lg" role="banner">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-8 text-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="flex items-center justify-center gap-3 text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
            <Database className="w-10 h-10 lg:w-12 lg:h-12" aria-hidden="true" />
            Simple Data Cleaner
          </h1>
          <p className="text-lg lg:text-xl opacity-95 max-w-2xl mx-auto leading-relaxed">Upload, clean, visualize, and transform your data with our professional tools</p>
        </div>
      </header>

      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm" role="navigation" aria-label="Data processing steps">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4 overflow-x-auto scrollbar-none">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = (fileData && step.id === 'preview') ||
                (cleanedData && ['visualize', 'transform'].includes(step.id))

              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 min-h-[48px] border-2
                      ${isActive 
                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg -translate-y-0.5' 
                        : isCompleted 
                        ? 'bg-green-500 border-green-500 text-white shadow-md' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    `}
                    onClick={() => handleStepChange(step.id)}
                    disabled={!isCompleted && step.id !== 'upload'}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`${step.label}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block w-8 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2" aria-hidden="true" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full" role="main">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 border-l-4 border-l-red-500 rounded-lg shadow-sm animate-slide-down" role="alert" aria-live="polite">
            <div className="flex justify-between items-start gap-3">
              <p className="text-red-800 dark:text-red-200 flex-1">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
                aria-label="Dismiss error message"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in" role="status" aria-live="polite" aria-label="Loading">
            <div className="loading-spinner mb-4" aria-hidden="true"></div>
            <p className="text-white text-lg font-medium">Processing...</p>
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

      <footer className="mt-auto bg-gray-800 dark:bg-gray-900 text-white text-center py-8 border-t border-gray-700" role="contentinfo">
        <p className="opacity-90 text-sm">&copy; 2024 Simple Data Cleaner. Built with React, Tailwind CSS, and FastAPI.</p>
      </footer>
    </div>
  )
}

export default App 
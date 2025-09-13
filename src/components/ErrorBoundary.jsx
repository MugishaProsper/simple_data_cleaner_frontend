import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // You could also log the error to an error reporting service here
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  handleReset = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in">
          <div className="max-w-2xl w-full text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse-slow" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 tracking-tight">
              Oops! Something went wrong
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              We encountered an unexpected error. This usually happens due to a temporary issue.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <summary className="p-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer bg-gray-100 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                  Technical Details (Development Mode)
                </summary>
                <div className="p-4 max-h-80 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Error:</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words mb-4">
                    {this.state.error.toString()}
                  </pre>
                  
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Stack Trace:</h4>
                  <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              {this.state.retryCount < 3 && (
                <button 
                  className="btn-primary min-w-[140px]" 
                  onClick={this.handleRetry}
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
              
              <button 
                className="btn-secondary min-w-[140px]" 
                onClick={this.handleReset}
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>

            {this.state.retryCount >= 3 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm">
                <p className="text-amber-800 dark:text-amber-200">
                  <strong className="text-gray-800 dark:text-gray-200">Still having issues?</strong> Try refreshing the page or contact support if the problem persists.
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
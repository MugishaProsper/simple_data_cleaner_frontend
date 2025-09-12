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
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon-container">
              <AlertTriangle className="error-boundary-icon" />
            </div>
            
            <h1 className="error-boundary-title">
              Oops! Something went wrong
            </h1>
            
            <p className="error-boundary-message">
              We encountered an unexpected error. This usually happens due to a temporary issue.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary className="error-boundary-summary">
                  Technical Details (Development Mode)
                </summary>
                <div className="error-boundary-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error.toString()}</pre>
                  
                  <h4>Stack Trace:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              {this.state.retryCount < 3 && (
                <button 
                  className="btn-primary error-retry-btn" 
                  onClick={this.handleRetry}
                >
                  <RefreshCw className="btn-icon" />
                  Try Again
                </button>
              )}
              
              <button 
                className="btn-secondary error-reset-btn" 
                onClick={this.handleReset}
              >
                <Home className="btn-icon" />
                Go to Home
              </button>
            </div>

            {this.state.retryCount >= 3 && (
              <div className="error-boundary-persistent">
                <p>
                  <strong>Still having issues?</strong> Try refreshing the page or contact support if the problem persists.
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
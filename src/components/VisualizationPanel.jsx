import { useState } from 'react'
import { BarChart3, LineChart, ScatterChart, PieChart, TrendingUp, Download } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const VisualizationPanel = ({ data, setLoading, setError }) => {
  const [selectedPlotType, setSelectedPlotType] = useState('bar')
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [hue, setHue] = useState('')
  const [generatedPlot, setGeneratedPlot] = useState(null)

  // Safety check for data
  if (!data || !data.columns) {
    return (
      <div className="visualization-panel">
        <div className="viz-header">
          <h2>Data Visualization</h2>
          <p>No data available for visualization</p>
        </div>
      </div>
    )
  }

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
    { id: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { id: 'scatter', label: 'Scatter Plot', icon: ScatterChart, description: 'Show relationships' },
    { id: 'hist', label: 'Histogram', icon: TrendingUp, description: 'Show distributions' },
    { id: 'heatmap', label: 'Heatmap', icon: PieChart, description: 'Show correlations' }
  ]

  const numericColumns = (data.columns || []).filter(col => {
    const dtype = data.data_types?.[col]
    return dtype && (dtype.includes('int') || dtype.includes('float') || dtype.includes('number'))
  })

  const categoricalColumns = (data.columns || []).filter(col => {
    const dtype = data.data_types?.[col]
    return dtype && !dtype.includes('int') && !dtype.includes('float') && !dtype.includes('number')
  })

  const handleGeneratePlot = async () => {
    if (!xAxis) {
      setError('Please select an X-axis column')
      return
    }

    if (selectedPlotType !== 'histogram' && !yAxis) {
      setError('Please select a Y-axis column')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/visualize`, {
        file_id: data.file_id,
        plot_type: selectedPlotType,
        x_column: xAxis,
        y_column: yAxis,
        title: `${selectedPlotType.charAt(0).toUpperCase() + selectedPlotType.slice(1)} Chart`
      })

      setGeneratedPlot(response.data.plot_url)
    } catch (error) {
      console.error('Visualization error:', error)
      const errorMessage = error.response?.data?.detail
        ? (Array.isArray(error.response.data.detail)
          ? error.response.data.detail[0]?.msg || 'Failed to generate visualization'
          : error.response.data.detail)
        : 'Failed to generate visualization'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPlot = () => {
    if (generatedPlot) {
      const link = document.createElement('a')
      link.href = `${API_BASE_URL}${generatedPlot}`
      link.download = `plot_${selectedPlotType}_${xAxis}_${yAxis || 'histogram'}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  return (
    <div className="visualization-panel">
      <div className="viz-header">
        <h2>Data Visualization</h2>
        <p>Create charts and graphs from your cleaned data</p>
      </div>

      <div className="viz-content">
        <div className="viz-controls">
          <div className="control-section">
            <h3>Chart Type</h3>
            <div className="plot-type-grid">
              {chartTypes.map(plot => (
                <button
                  key={plot.id}
                  className={`plot-type-button ${selectedPlotType === plot.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlotType(plot.id)}
                >
                  <plot.icon className="plot-icon" />
                  <span className="plot-label">{plot.label}</span>
                  <span className="plot-description">{plot.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>Chart Configuration</h3>

            <div className="axis-controls">
              <div className="axis-control">
                <label>X-Axis (Required)</label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  <option value="">Select X-axis column</option>
                  {(data.columns || []).map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {selectedPlotType !== 'histogram' && (
                <div className="axis-control">
                  <label>Y-Axis (Required)</label>
                  <select
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                  >
                    <option value="">Select Y-axis column</option>
                    {(data.columns || []).map(col => (
                      <option key={col} value={col}>{col} ({data.data_types?.[col] || 'unknown'})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="axis-control">
                <label>Color/Hue (Optional)</label>
                <select
                  value={hue}
                  onChange={(e) => setHue(e.target.value)}
                >
                  <option value="">No color grouping</option>
                  {categoricalColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="control-section">
            <h3>Data Summary</h3>
            <div className="data-summary">
              <div className="summary-item">
                <span>Total rows:</span>
                <span>{data.cleaned_shape[0].toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span>Total columns:</span>
                <span>{data.cleaned_shape[1]}</span>
              </div>
              <div className="summary-item">
                <span>Numeric columns:</span>
                <span>{numericColumns.length}</span>
              </div>
              <div className="summary-item">
                <span>Categorical columns:</span>
                <span>{categoricalColumns.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="viz-preview">
          <div className="preview-header">
            <h3>Generated Visualization</h3>
            {generatedPlot && (
              <button className="btn-secondary" onClick={handleDownloadPlot}>
                <Download className="btn-icon" />
                Download Plot
              </button>
            )}
          </div>

          <div className="plot-container">
            {generatedPlot ? (
              <img
                src={`${API_BASE_URL}${generatedPlot}`}
                alt="Generated plot"
                className="generated-plot"
              />
            ) : (
              <div className="plot-placeholder">
                <BarChart3 className="placeholder-icon" />
                <p>Configure your chart options and click "Generate Plot" to create a visualization</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="viz-actions">
        <button
          className="btn-primary"
          onClick={handleGeneratePlot}
          disabled={!xAxis || (selectedPlotType !== 'histogram' && !yAxis)}
        >
          <BarChart3 className="btn-icon" />
          Generate Plot
        </button>
      </div>
    </div>
  )
}

export default VisualizationPanel 
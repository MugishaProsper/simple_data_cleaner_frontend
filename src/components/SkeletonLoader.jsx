const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => {
    if (type === 'card') {
      return (
        <div key={index} className={`skeleton-card ${className}`}>
          <div className="skeleton-header">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        </div>
      )
    }

    if (type === 'table') {
      return (
        <div key={index} className={`skeleton-table ${className}`}>
          <div className="skeleton-table-header">
            {Array.from({ length: 5 }, (_, colIndex) => (
              <div key={colIndex} className="skeleton-line skeleton-th"></div>
            ))}
          </div>
          <div className="skeleton-table-body">
            {Array.from({ length: 5 }, (_, rowIndex) => (
              <div key={rowIndex} className="skeleton-table-row">
                {Array.from({ length: 5 }, (_, colIndex) => (
                  <div key={colIndex} className="skeleton-line skeleton-td"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (type === 'line') {
      return (
        <div key={index} className={`skeleton-line ${className}`}></div>
      )
    }

    if (type === 'chart') {
      return (
        <div key={index} className={`skeleton-chart ${className}`}>
          <div className="skeleton-chart-header">
            <div className="skeleton-line skeleton-title"></div>
          </div>
          <div className="skeleton-chart-content">
            <div className="skeleton-bars">
              {Array.from({ length: 6 }, (_, barIndex) => (
                <div 
                  key={barIndex} 
                  className="skeleton-bar" 
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={index} className={`skeleton-default ${className}`}>
        <div className="skeleton-line"></div>
      </div>
    )
  })

  return <div className="skeleton-container">{skeletons}</div>
}

export default SkeletonLoader
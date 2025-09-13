const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => {
    if (type === 'card') {
      return (
        <div key={index} className={`card p-6 ${className}`}>
          <div className="space-y-2 mb-4">
            <div className="skeleton h-6 w-3/5 rounded"></div>
            <div className="skeleton h-4 w-2/5 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-4/5 rounded"></div>
          </div>
        </div>
      )
    }

    if (type === 'table') {
      return (
        <div key={index} className={`table-container ${className}`}>
          <div className="grid grid-cols-5 gap-3 p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            {Array.from({ length: 5 }, (_, colIndex) => (
              <div key={colIndex} className="skeleton h-5 w-full rounded"></div>
            ))}
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 5 }, (_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-3 p-3">
                {Array.from({ length: 5 }, (_, colIndex) => (
                  <div key={colIndex} className="skeleton h-4 w-4/5 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (type === 'line') {
      return (
        <div key={index} className={`skeleton h-4 w-full rounded ${className}`}></div>
      )
    }

    if (type === 'chart') {
      return (
        <div key={index} className={`card p-6 ${className}`}>
          <div className="mb-6">
            <div className="skeleton h-6 w-3/5 rounded"></div>
          </div>
          <div className="h-80 flex items-end justify-center">
            <div className="flex items-end gap-2 h-full w-4/5">
              {Array.from({ length: 6 }, (_, barIndex) => (
                <div 
                  key={barIndex} 
                  className="skeleton flex-1 rounded-t" 
                  style={{ height: `${Math.random() * 60 + 20}%`, minHeight: '20%' }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={index} className={`${className}`}>
        <div className="skeleton h-4 w-full rounded"></div>
      </div>
    )
  })

  return <div className="flex flex-col gap-4">{skeletons}</div>
}

export default SkeletonLoader
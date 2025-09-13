import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'

const ThemeToggle = ({ showLabel = false, variant = 'button' }) => {
  const { theme, toggleTheme, setLightTheme, setDarkTheme } = useTheme()
  const [showOptions, setShowOptions] = useState(false)

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Toggle theme options"
        >
          {theme === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
          {theme === 'dark' && <Moon className="w-5 h-5 text-blue-400" />}
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
            <button
              onClick={() => {
                setLightTheme()
                setShowOptions(false)
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                theme === 'light' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light Mode
            </button>
            <button
              onClick={() => {
                setDarkTheme()
                setShowOptions(false)
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark Mode
            </button>
          </div>
        )}

        {/* Overlay to close dropdown */}
        {showOptions && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowOptions(false)}
          />
        )}
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center gap-2 p-2 rounded-lg transition-all duration-200 
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${showLabel ? 'px-3 py-2' : ''}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`} 
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  )
}

export default ThemeToggle
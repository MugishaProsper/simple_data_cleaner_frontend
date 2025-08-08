# Simple Data Cleaner - Frontend

A modern, clean React frontend for the Simple Data Cleaner application. This application provides an intuitive interface for uploading, cleaning, visualizing, and transforming CSV data.

## Features

### 📁 File Upload
- Drag and drop CSV file upload
- Real-time file validation
- Progress indicators and status feedback
- Support for large CSV files

### 📊 Data Preview
- Comprehensive data summary with statistics
- Interactive data preview table
- Missing value analysis with visual indicators
- Data type detection and categorization
- Issue identification and recommendations

### 🧹 Data Cleaning
- Configurable cleaning options:
  - Fill missing values
  - Remove duplicates
  - Standardize column names
  - Fix data types
  - Handle outliers
  - Strip whitespace
  - Parse dates
  - Remove constant columns
- Real-time cleaning results
- Before/after comparison
- Download cleaned data

### 📈 Data Visualization
- Multiple chart types:
  - Bar charts
  - Line charts
  - Scatter plots
  - Histograms
  - Heatmaps
- Interactive chart configuration
- Column type-aware axis selection
- Download generated plots
- Real-time plot generation

### 🔄 Data Transformation
- Mathematical transformations:
  - Min-Max normalization
  - Z-score standardization
  - Logarithmic transformation
- Column selection interface
- Transformation preview
- Download transformed data

## Technology Stack

- **React 19.1.1** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API communication
- **React Dropzone** - File upload with drag & drop
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with responsive design

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

The frontend communicates with the FastAPI backend through the following endpoints:

- `POST /upload` - Upload CSV files
- `POST /clean` - Clean data with specified options
- `POST /visualize` - Generate data visualizations
- `POST /transform` - Apply data transformations
- `GET /download/{file_id}` - Download processed data

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx      # File upload component
│   │   ├── DataPreview.jsx     # Data preview and analysis
│   │   ├── CleaningOptions.jsx # Data cleaning interface
│   │   ├── VisualizationPanel.jsx # Chart generation
│   │   └── TransformationPanel.jsx # Data transformation
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Comprehensive styling
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
└── README.md                # This file
```

## Key Features

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly controls

### User Experience
- Step-by-step workflow
- Progress indicators
- Error handling and user feedback
- Loading states and animations

### Data Handling
- Real-time data validation
- Efficient data processing
- Memory-conscious operations
- Secure file handling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality and consistency. The configuration is optimized for React development with modern JavaScript features.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Simple Data Cleaner application. See the main project README for license information.

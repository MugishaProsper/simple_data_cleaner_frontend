import { create } from 'zustand';

const useDataStore = create((set) => ({
  // State
  fileData: null,
  cleanedData: null,
  currentStep: 'upload',
  loading: false,
  error: null,
  
  // Actions
  setFileData: (data) => set({ 
    fileData: data, 
    currentStep: 'preview', 
    error: null 
  }),
  
  setCleanedData: (data) => set({ 
    cleanedData: data, 
    currentStep: 'visualize' 
  }),
  
  setCurrentStep: (step) => set((state) => {
    // Validate step transitions
    const validTransitions = {
      upload: ['preview'],
      preview: ['upload', 'clean'],
      clean: ['preview', 'visualize'],
      visualize: ['transform', 'clean'],
      transform: ['visualize']
    };

    if (validTransitions[state.currentStep]?.includes(step)) {
      return { currentStep: step };
    }
    return {}; // No state update if transition is invalid
  }),
  
  setLoading: (isLoading) => set({ loading: isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({ 
    fileData: null, 
    cleanedData: null, 
    currentStep: 'upload',
    loading: false,
    error: null 
  })
}));

export default useDataStore;

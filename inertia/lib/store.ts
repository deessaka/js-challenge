import { create } from 'zustand'

interface AppState {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  currentExercise: number | null
  setCurrentExercise: (exerciseId: number | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  currentExercise: null,
  setCurrentExercise: (exerciseId) => set({ currentExercise: exerciseId }),
}))

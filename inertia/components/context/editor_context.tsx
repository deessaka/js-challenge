import React, { createContext, useState, useContext, ReactNode } from 'react'

interface EditorContextType {
  editorValue: string
  setEditorValue: (value: string) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider')
  }
  return context
}

interface EditorProviderProps {
  children: ReactNode
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [editorValue, setEditorValue] = useState('')

  const value = {
    editorValue,
    setEditorValue,
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

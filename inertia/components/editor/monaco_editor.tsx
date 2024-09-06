import * as editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '~/providers/theme_context'

interface MonacoEditorProps {
  exerciseId: number
  initialcode: string
  onChange: (value: string) => void
  syncServer?: () => void
}

export const MonacoEditor = ({ exerciseId, initialcode = '', onChange }: MonacoEditorProps) => {
  const { theme } = useTheme()
  const monaco = editor.useMonaco()
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)
  const [value, setValue] = useState(initialcode)

  useEffect(() => {
    const storeCode = localStorage.getItem(`exercise_${exerciseId}_code`)
    if (storeCode) {
      setValue(storeCode)
    }
    if (monaco) {
      console.log('here is the monaco instance:', monaco)
    }
  }, [monaco, exerciseId])

  const handleEditorDidMount = (mountedEditor: editor.IStandaloneCodeEditor) => {
    editorRef.current = mountedEditor
    mountedEditor.focus()
  }

  return (
    <editor.Editor
      height="75vh"
      defaultLanguage="javascript"
      theme={theme && theme === 'dark' ? 'vs-dark' : 'light'}
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
      }}
    />
  )
}

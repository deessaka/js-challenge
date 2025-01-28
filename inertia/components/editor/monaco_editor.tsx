import * as editor from '@monaco-editor/react'
import * as monanco from 'monaco-editor/esm/vs/editor/editor.api'
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
  const editorRef = useRef<monanco.editor.IStandaloneCodeEditor>(null)
  const [value, setValue] = useState(initialcode)

  useEffect(() => {
    const storeCode = localStorage.getItem(`exercise_${exerciseId}_code`)
    if (storeCode) {
      setValue(storeCode)
    }
    if (monaco) {
      // set the initial value
      setTimeout(() => {
        monaco.editor.getModels()[0].onDidChangeContent(() => {
          const value = monaco.editor.getModels()[0].getValue()
          setValue(value)
          onChange(value)
        })
      })
    }
  }, [monaco, exerciseId])

  const handleEditorDidMount = (mountedEditor: monanco.editor.IStandaloneCodeEditor) => {
    editorRef.current = mountedEditor
    mountedEditor.focus()
  }

  return (
    <editor.Editor
      height="75vh"
      defaultLanguage="javascript"
      language="javascript"
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

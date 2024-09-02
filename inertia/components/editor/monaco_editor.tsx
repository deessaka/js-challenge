import { useEditor } from '#components/context/editor_context'
import { Button } from '#components/ui/components/ui/button'
import * as editor from '@monaco-editor/react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

const pistonAPI = axios.create({
  baseURL: 'https://emkc.org/api/v2/piston',
})

// Function to execute code using Piston API
async function executeCode(language: string, sourceCode: string) {
  try {
    const response = await pistonAPI.post('/execute', {
      language: language,
      version: '*', // Use the latest version
      files: [
        {
          name: 'main', // This can be any name
          content: sourceCode,
        },
      ],
      stdin: '', // Standard input (if needed)
      args: [], // Command line arguments (if needed)
    })

    return response.data
  } catch (error) {
    console.error('Error executing code:', error)
    throw error
  }
}

export default function MonacoEditor() {
  const monaco = editor.useMonaco()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [value, setValue] = useState('')
  const { setEditorValue } = useEditor()

  useEffect(() => {
    const storeCode = localStorage.getItem('code') || ''
    if (editorRef.current) {
      editorRef.current.setValue(storeCode)
      editorRef.current.focus()
    }
    if (monaco) {
      console.log('here is the monaco instance:', monaco)
    }
  }, [monaco])

  useEffect(() => {
    if (editorRef.current) {
      const onChange = editorRef.current.onDidChangeModelContent(() => {
        const newCode = editorRef.current.getValue()
        localStorage.setItem('code', newCode)
      })
      return () => {
        onChange.dispose()
      }
    }
  }, [])

  const handleEditorDidMount = (mountedEditor: editor.IStandaloneCodeEditor) => {
    editorRef.current = mountedEditor
    mountedEditor.focus()
  }

  const handleRunCode = async () => {
    const sourceCode = editorRef.current?.getValue()
    if (!sourceCode) return

    try {
      const response = await executeCode('javascript', sourceCode)
      setEditorValue(response.run.stdout)
    } catch (error) {
      console.error('Failed to execute code:', error)
    }
  }

  const handleSaveCode = () => {}

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <editor.Editor
        height="75vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={value}
        onChange={(value: string | undefined) => setValue(value || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
        }}
      />
      <div className="flex gap-4 items-center justify-center p-4">
        {/* display action buttons: run, save, share, etc. */}
        <Button
          variant={'outline'}
          onClick={handleRunCode}
          className="border-primary-light text-primary-light hover:bg-primary-dark/80"
        >
          Run Code
        </Button>
        <Button
          onClick={handleSaveCode}
          className="bg-primary-light text-secondary-foreground hover:bg-primary-dark/80"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

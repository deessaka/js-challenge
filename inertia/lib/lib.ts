import axios from 'axios'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const pistonAPI = axios.create({
  baseURL: 'https://emkc.org/api/v2/piston',
})

// Function to execute code using Piston API
export async function executeCode(language: string, sourceCode: string) {
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

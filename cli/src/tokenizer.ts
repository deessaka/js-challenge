export interface Token {
  text: string
  color?: string
}

const THEME = {
  keyword: '#cba6f7',
  function: '#89b4fa',
  string: '#a6e3a1',
  number: '#fab387',
  comment: '#6c7086',
  text: '#cdd6f4'
}

type TokenizerState = 'default' | 'string_single' | 'string_double' | 'string_backtick' | 'comment_block'

export function tokenize(line: string, initialState: TokenizerState = 'default'): Token[] {
  const { tokens } = tokenizeLine(line, initialState)
  return tokens
}

export function tokenizeDocumentLines(lines: readonly string[]): { tokens: Token[][], states: TokenizerState[] } {
  const tokens: Token[][] = []
  const states: TokenizerState[] = []
  let currentState: TokenizerState = 'default'

  for (const line of lines) {
    states.push(currentState)
    const result = tokenizeLine(line, currentState)
    tokens.push(result.tokens)
    currentState = result.finalState
  }

  return { tokens, states }
}

function tokenizeLine(line: string, initialState: TokenizerState): { tokens: Token[], finalState: TokenizerState } {
  const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'class', 'extends', 'super', 'import',
    'export', 'default', 'true', 'false', 'null', 'undefined', 'new', 'this',
    'typeof', 'instanceof', 'void', 'delete', 'await', 'async', 'yield',
    'console', 'Math', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Date'
  ])

  let state = initialState
  const tokens: Token[] = []
  let current = ''

  const pushWord = (word: string) => {
    if (keywords.has(word)) {
      tokens.push({ text: word, color: THEME.keyword })
    } else if (!isNaN(Number(word)) && word.trim() !== '') {
      tokens.push({ text: word, color: THEME.number })
    } else {
      tokens.push({ text: word })
    }
  }

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (state === 'comment_block') {
      current += char
      if (char === '/' && line[i - 1] === '*') {
        tokens.push({ text: current, color: THEME.comment })
        current = ''
        state = 'default'
      }
      continue
    }

    if (state === 'string_single') {
      current += char
      if (char === "'" && line[i - 1] !== '\\') {
        tokens.push({ text: current, color: THEME.string })
        current = ''
        state = 'default'
      }
      continue
    }

    if (state === 'string_double') {
      current += char
      if (char === '"' && line[i - 1] !== '\\') {
        tokens.push({ text: current, color: THEME.string })
        current = ''
        state = 'default'
      }
      continue
    }

    if (state === 'string_backtick') {
      current += char
      if (char === '`' && line[i - 1] !== '\\') {
        tokens.push({ text: current, color: THEME.string })
        current = ''
        state = 'default'
      }
      continue
    }

    if (char === '/' && line[i + 1] === '/') {
      if (current) pushWord(current)
      tokens.push({ text: line.substring(i), color: THEME.comment })
      current = ''
      break
    }
    
    if (char === '/' && line[i + 1] === '*') {
      if (current) pushWord(current)
      current = char
      state = 'comment_block'
      continue
    }

    if (char === "'") {
      if (current) pushWord(current)
      current = char
      state = 'string_single'
      continue
    }

    if (char === '"') {
      if (current) pushWord(current)
      current = char
      state = 'string_double'
      continue
    }

    if (char === '`') {
      if (current) pushWord(current)
      current = char
      state = 'string_backtick'
      continue
    }

    if (/[a-zA-Z0-9_$]/.test(char)) {
      current += char
    } else {
      if (current) {
        let isFunction = false
        let j = i
        while (j < line.length && /\s/.test(line[j])) j++
        if (line[j] === '(' && !keywords.has(current) && isNaN(Number(current))) {
          isFunction = true
        }
        if (isFunction) {
          tokens.push({ text: current, color: THEME.function })
        } else {
          pushWord(current)
        }
      }
      tokens.push({ text: char })
      current = ''
    }
  }

  if (current) {
    if (state === 'comment_block') {
      tokens.push({ text: current, color: THEME.comment })
    } else if (state.startsWith('string')) {
      tokens.push({ text: current, color: THEME.string })
    } else {
      pushWord(current)
    }
  }

  const merged: Token[] = []
  for (const t of tokens) {
    if (merged.length > 0 && merged[merged.length - 1].color === t.color) {
      merged[merged.length - 1].text += t.text
    } else {
      merged.push({ ...t })
    }
  }

  return { tokens: merged, finalState: state }
}

export function sliceTokens(tokens: Token[], start: number, end: number): Token[] {
  const result: Token[] = []
  let currentIndex = 0
  
  for (const token of tokens) {
    const tokenStart = currentIndex
    const tokenEnd = currentIndex + token.text.length
    
    if (tokenEnd > start && tokenStart < end) {
      const sliceStart = Math.max(0, start - tokenStart)
      const sliceEnd = Math.min(token.text.length, end - tokenStart)
      result.push({ text: token.text.slice(sliceStart, sliceEnd), color: token.color })
    }
    
    currentIndex = tokenEnd
    if (currentIndex >= end) break
  }
  
  return result
}


/**
 * Detects if a trimmed line looks like a code example.
 * Examples: functionName(args)  result, or standalone result values.
 */
function isCodeLine(line: string): boolean {
  if (!line) return false
  // Matches: identifier followed by ( — e.g. number([[...]]), removeDuplicates([...])
  // or a URL-like line starting with http
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/.test(line) || /^https?:\/\//.test(line)
}

type Section = { type: 'prose'; lines: string[] } | { type: 'code'; lines: string[] }

/**
 * Parses raw description text (copy-pasted from PDF) into a structured list of sections.
 *
 * Handles:
 * - Superscript artifacts: \n[a-z]{1,3}\n after digits → joins as inline
 * - Soft-wrapped lines: mid-sentence newlines from PDF columns → joined with a space
 * - Code example lines: wrapped in their own section
 * - Blank lines: used as paragraph separators
 */
function parseDescription(raw: string): Section[] {
  // Step 1: Fix superscript artifacts — `2\ne\n nombre` → `2e nombre`
  // Pattern: digit + newline + 1–3 lowercase letters + newline
  let text = raw.replace(/(\d)\n([a-zA-Zèème]{1,3})\n/g, '$1$2 ')

  // Step 2: Merge continuation lines (lines ending without sentence-terminating punctuation)
  // We'll handle this during the split pass below.
  const rawLines = text.split('\n')

  const sections: Section[] = []
  let currentProse: string[] = []

  function flushProse() {
    if (currentProse.length === 0) return
    // Merge "soft-wrapped" lines: if a line doesn't end with sentence-final punctuation,
    // the next line is a continuation.
    const merged: string[] = []
    let accumulator = ''
    for (const l of currentProse) {
      const stripped = l.replace(/  +/g, ' ').trim()
      if (!stripped) continue
      if (accumulator === '') {
        accumulator = stripped
      } else {
        // Does the accumulator end with hard-punctuation or a colon?
        if (/[.!?:;]$/.test(accumulator)) {
          merged.push(accumulator)
          accumulator = stripped
        } else {
          // Soft wrap — join with space
          accumulator += ' ' + stripped
        }
      }
    }
    if (accumulator) merged.push(accumulator)
    if (merged.length > 0) sections.push({ type: 'prose', lines: merged })
    currentProse = []
  }

  let codeBuffer: string[] = []

  function flushCode() {
    if (codeBuffer.length === 0) return
    sections.push({ type: 'code', lines: [...codeBuffer] })
    codeBuffer = []
  }

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim()

    if (isCodeLine(trimmed)) {
      // Code line: replace double-space (PDF arrow artifact) with → symbol, then normalize
      const codeLine = trimmed
        .replace(/  +/g, ' → ') // double space = arrow in original PDF
        .replace(/ → $/g, '')   // remove trailing arrow if at end
        .trim()
      flushProse()
      codeBuffer.push(codeLine)
    } else {
      // Before starting prose, flush any accumulated code
      if (codeBuffer.length > 0) {
        flushCode()
      }
      if (trimmed === '') {
        // Blank line = paragraph separator
        flushProse()
      } else {
        // Normalize multiple spaces for prose only
        currentProse.push(trimmed.replace(/  +/g, ' '))
      }
    }
  }

  // Flush whatever remains
  flushProse()
  flushCode()

  return sections
}

interface DescriptionRendererProps {
  description: string
  className?: string
}

export function DescriptionRenderer({ description, className = '' }: DescriptionRendererProps) {
  const sections = parseDescription(description)

  return (
    <div className={`space-y-4 text-gray-200 text-sm leading-relaxed ${className}`}>
      {sections.map((section, idx) => {
        if (section.type === 'code') {
          return (
            <div
              key={idx}
              className="rounded-lg bg-black/40 border border-indigo-500/20 px-4 py-3 font-mono text-xs overflow-auto"
            >
              {section.lines.map((line, li) => (
                <div key={li} className="text-indigo-200 whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>
          )
        }

        return (
          <div key={idx} className="space-y-2">
            {section.lines.map((line, li) => {
              // Detect bullet points (lines starting with •, *, -, or a number.)
              if (/^[•\-*]\s/.test(line)) {
                return (
                  <div key={li} className="flex items-start gap-2 pl-2">
                    <span className="text-indigo-400 mt-0.5 shrink-0">▸</span>
                    <span>{line.replace(/^[•\-*]\s/, '')}</span>
                  </div>
                )
              }
              if (/^\d+\.\s/.test(line)) {
                const num = line.match(/^(\d+)\.\s/)![1]
                return (
                  <div key={li} className="flex items-start gap-2 pl-2">
                    <span className="text-indigo-400 font-bold shrink-0 tabular-nums">{num}.</span>
                    <span>{line.replace(/^\d+\.\s/, '')}</span>
                  </div>
                )
              }
              return <p key={li}>{line}</p>
            })}
          </div>
        )
      })}
    </div>
  )
}

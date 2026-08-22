import { test } from '@japa/runner'

import { renderDocumentationMarkdown } from '#services/documentation_service'

test.group('Documentation Markdown pipeline', () => {
  test('sanitizes executable markup and unsafe URLs', ({ assert }) => {
    const rendered = renderDocumentationMarkdown(`
# Secure document

<script>alert(1)</script>

[unsafe link](javascript:alert(1))

<iframe src="https://evil.example"></iframe>

\`\`\`javascript
const value = 1
\`\`\`
`)

    assert.notInclude(rendered.html, '<script')
    assert.notInclude(rendered.html, '<iframe')
    assert.notInclude(rendered.html, 'href="javascript:')
    assert.include(rendered.html, 'hljs')
    assert.include(rendered.html, 'language-javascript')
  })
})

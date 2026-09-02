import type { CodeLine } from './types'

interface CodePanelProps {
  lines: CodeLine[]
  activeLineId: string
  filename?: string
}

export function CodePanel({ lines, activeLineId, filename = 'Solution.java' }: CodePanelProps) {
  return (
    <div className="live-code">
      <header><span>{filename}</span><i>同步高亮</i></header>
      <pre><code>{lines.map((line, index) => (
        <span className={line.id === activeLineId ? 'active-line' : ''} key={line.id}>
          <b>{String(index + 1).padStart(2, '0')}</b><i className="code-text">{line.text}</i>
        </span>
      ))}</code></pre>
    </div>
  )
}

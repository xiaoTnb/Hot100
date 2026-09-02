import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ProblemDefinition } from '../../problems/types'

interface ProblemPickerProps {
  problems: ProblemDefinition[]
  activeSlug: string
  onSelect: (slug: string) => void
  onClose: () => void
}

export function ProblemPicker({ problems, activeSlug, onSelect, onClose }: ProblemPickerProps) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredProblems = problems.filter((problem) => {
    const searchable = [problem.number, problem.leetcodeId, problem.title, problem.difficultyLabel, ...problem.tags].join(' ').toLowerCase()
    return searchable.includes(normalizedQuery)
  })

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="problem-list-overlay" onMouseDown={onClose}>
      <section className="problem-list-dialog" role="dialog" aria-modal="true" aria-labelledby="problem-list-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><h2 id="problem-list-title">题目列表</h2><p>已添加 {problems.length} / 100 题</p></div><button onClick={onClose} aria-label="关闭题目列表"><X size={18} /></button></header>
        <label className="problem-search"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索题号、标题或标签" aria-label="搜索题目" /></label>
        <div className="problem-list-results">
          {filteredProblems.map((problem) => (
            <button className={problem.slug === activeSlug ? 'active' : ''} onClick={() => onSelect(problem.slug)} key={problem.slug} aria-current={problem.slug === activeSlug ? 'page' : undefined}>
              <b>{problem.number}</b><span><strong>{problem.title}</strong><small>{problem.difficultyLabel} / {problem.tags.join(' / ')}</small></span><ArrowRight size={16} />
            </button>
          ))}
          {filteredProblems.length === 0 && <div className="problem-list-empty"><Search size={22} /><p>没有找到匹配的题目</p><button onClick={() => setQuery('')}>清除搜索</button></div>}
        </div>
      </section>
    </div>
  )
}

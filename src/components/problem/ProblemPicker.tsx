import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CodeLanguage } from '../player/types'
import type { ProblemDefinition } from '../../problems/types'

type LanguageFilter = 'all' | CodeLanguage

interface ProblemPickerProps {
  problems: ProblemDefinition[]
  activeSlug: string
  preferredLanguage: CodeLanguage
  onSelect: (slug: string) => void
  onClose: () => void
}

const languageLabels: Record<CodeLanguage, string> = { java: 'Java', javascript: 'JS' }
const supportedLanguages = (problem: ProblemDefinition) => problem.languages ?? ['java']

export function ProblemPicker({ problems, activeSlug, preferredLanguage, onSelect, onClose }: ProblemPickerProps) {
  const [query, setQuery] = useState('')
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>(preferredLanguage)
  const normalizedQuery = query.trim().toLowerCase()
  const filteredProblems = problems.filter((problem) => {
    const searchable = [problem.number, problem.leetcodeId, problem.title, problem.difficultyLabel, ...problem.tags].join(' ').toLowerCase()
    const matchesLanguage = languageFilter === 'all' || supportedLanguages(problem).includes(languageFilter)
    return matchesLanguage && searchable.includes(normalizedQuery)
  })
  const languageCounts = {
    java: problems.filter((problem) => supportedLanguages(problem).includes('java')).length,
    javascript: problems.filter((problem) => supportedLanguages(problem).includes('javascript')).length,
  }

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="problem-list-overlay" onMouseDown={onClose}>
      <section className="problem-list-dialog" role="dialog" aria-modal="true" aria-labelledby="problem-list-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><h2 id="problem-list-title">题目列表</h2><p>显示 {filteredProblems.length} 题，已添加 {problems.length} / 100</p></div><button onClick={onClose} aria-label="关闭题目列表"><X size={18} /></button></header>
        <div className="problem-language-filter" role="group" aria-label="按代码语言筛选">
          <button className={languageFilter === 'all' ? 'active' : ''} onClick={() => setLanguageFilter('all')} aria-pressed={languageFilter === 'all'}>全部 <small>{problems.length}</small></button>
          <button className={languageFilter === 'java' ? 'active' : ''} onClick={() => setLanguageFilter('java')} aria-pressed={languageFilter === 'java'}>Java <small>{languageCounts.java}</small></button>
          <button className={languageFilter === 'javascript' ? 'active' : ''} onClick={() => setLanguageFilter('javascript')} aria-pressed={languageFilter === 'javascript'}>JS <small>{languageCounts.javascript}</small></button>
        </div>
        <label className="problem-search"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索题号、标题或标签" aria-label="搜索题目" /></label>
        <div className="problem-list-results">
          {filteredProblems.map((problem) => (
            <button className={problem.slug === activeSlug ? 'active' : ''} onClick={() => onSelect(problem.slug)} key={problem.slug} aria-current={problem.slug === activeSlug ? 'page' : undefined}>
              <b>{problem.number}</b><span><strong>{problem.title}</strong><small>{problem.difficultyLabel} / {problem.tags.join(' / ')}</small></span>
              <span className="problem-language-support" aria-label={`支持 ${supportedLanguages(problem).map((language) => languageLabels[language]).join('、')}`}>
                {supportedLanguages(problem).map((language) => <i key={language}>{languageLabels[language]}</i>)}
              </span>
              <ArrowRight size={16} />
            </button>
          ))}
          {filteredProblems.length === 0 && <div className="problem-list-empty"><Search size={22} /><p>{languageFilter === 'javascript' && !normalizedQuery ? '暂时没有支持 JavaScript 的题目' : '没有找到匹配的题目'}</p><button onClick={() => { setQuery(''); setLanguageFilter('all') }}>查看全部题目</button></div>}
        </div>
      </section>
    </div>
  )
}

import { ArrowLeft, ArrowRight, List, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { ProblemPicker } from './components/problem/ProblemPicker'
import { findProblem, problems } from './problems/registry'

function problemFromUrl() {
  return findProblem(new URLSearchParams(window.location.search).get('problem')) ?? problems[0]
}

function App() {
  const [problemSlug, setProblemSlug] = useState(() => problemFromUrl().slug)
  const [problemPanelOpen, setProblemPanelOpen] = useState(true)
  const [problemListOpen, setProblemListOpen] = useState(false)
  const problemIndex = useMemo(() => Math.max(0, problems.findIndex((problem) => problem.slug === problemSlug)), [problemSlug])
  const problem = problems[problemIndex]
  const previousProblem = problems[problemIndex - 1]
  const nextProblem = problems[problemIndex + 1]
  const Visualizer = problem.Visualizer

  const switchProblem = useCallback((slug: string, updateHistory = true) => {
    const target = findProblem(slug)
    if (!target) return
    setProblemSlug(target.slug)
    if (updateHistory) {
      const url = new URL(window.location.href)
      url.searchParams.set('problem', target.slug)
      window.history.pushState({}, '', url)
    }
  }, [])

  useEffect(() => {
    const syncFromHistory = () => switchProblem(problemFromUrl().slug, false)
    window.addEventListener('popstate', syncFromHistory)
    return () => window.removeEventListener('popstate', syncFromHistory)
  }, [switchProblem])

  const chooseProblem = (slug: string) => {
    switchProblem(slug)
    setProblemListOpen(false)
  }

  return (
    <div id="top">
      <main className={problemPanelOpen ? '' : 'problem-panel-collapsed'}>
        <section className="problem-intro shell" id="problem" aria-labelledby="problem-title">
          <button className="problem-panel-toggle" onClick={() => setProblemPanelOpen((open) => !open)} aria-expanded={problemPanelOpen} aria-controls="problem-overview" title={problemPanelOpen ? '收起题目栏' : '展开题目栏'}>
            {problemPanelOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          {!problemPanelOpen && <span className="collapsed-problem-label"><b>{problem.number}</b><i>{problem.title}</i></span>}
          <div className="problem-overview" id="problem-overview">
            <div className="problem-title-block">
              <div className="problem-copy">
                <div className="problem-tags"><span className={problem.difficulty}>{problem.difficultyLabel}</span><span>{problem.leetcodeId}</span>{problem.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <h1 id="problem-title">{problem.title}</h1>
              </div>
            </div>
            <div className="problem-brief">
              <p className="problem-lead">{problem.lead}</p>
              <p className="problem-note">{problem.note}</p>
            </div>
            <div className="example-line"><span>示例</span><div className="example-values">{problem.example}</div></div>
            <nav className="problem-step-nav" aria-label="题目翻页">
              <button className="problem-step-button" disabled={!previousProblem} onClick={() => previousProblem && switchProblem(previousProblem.slug)} aria-label={previousProblem ? `上一题：${previousProblem.title}` : '已经是第一题'}><ArrowLeft size={17} /><span>上一题</span></button>
              <button className="problem-list-button" onClick={() => setProblemListOpen(true)} aria-haspopup="dialog"><List size={16} /><span>题目列表</span></button>
              <button className="problem-step-button" disabled={!nextProblem} onClick={() => nextProblem && switchProblem(nextProblem.slug)} aria-label={nextProblem ? `下一题：${nextProblem.title}` : '已经是最后一题'}><span>下一题</span><ArrowRight size={17} /></button>
            </nav>
          </div>
        </section>

        <section className="visualizer-section" id="visualizer">
          <div className="shell">
            <Suspense fallback={<div className="visualizer-loading">正在加载动画…</div>}>
              <Visualizer key={problem.slug} />
            </Suspense>
          </div>
        </section>
      </main>

      {problemListOpen && <ProblemPicker problems={problems} activeSlug={problem.slug} onSelect={chooseProblem} onClose={() => setProblemListOpen(false)} />}
    </div>
  )
}

export default App

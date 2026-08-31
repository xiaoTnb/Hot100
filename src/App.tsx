import { ArrowDown, ArrowLeft, ArrowRight, Code2 } from 'lucide-react'
import { useState } from 'react'
import { GroupAnagramsVisualizer } from './components/GroupAnagramsVisualizer'
import { Logo } from './components/Logo'
import { TwoSumVisualizer } from './components/TwoSumVisualizer'

type ProblemId = 1 | 2

const problemContent = {
  1: {
    number: '01', title: '两数之和', difficulty: '简单', tags: ['数组', '哈希表'],
    lead: <>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请找出和为目标值的两个整数，并返回它们的数组下标。</>,
    note: '每种输入只会对应一个答案，且同一个元素不能重复使用。答案可以按任意顺序返回。',
    example: <><code>nums = [2, 11, 7, 15]</code><code>target = 9</code><strong>→ [0, 2]</strong></>,
    heading: '让每一步都看得见', description: '切换解法或示例，然后播放动画。代码会跟随当前步骤同步高亮。',
  },
  2: {
    number: '49', title: '字母异位词分组', difficulty: '中等', tags: ['哈希表', '字符串'],
    lead: <>给你一个字符串数组，请将字母异位词组合在一起。结果列表可以按任意顺序返回。</>,
    note: '字母异位词包含完全相同的字母，只是排列顺序不同。',
    example: <><code>strs = ["eat", "tea", "tan", "ate", "nat", "bat"]</code><strong>→ [["eat", "tea", "ate"], ...]</strong></>,
    heading: '把相同的字母，放进同一个桶', description: '逐个字符串排序得到 key，再用哈希表把相同 key 的原字符串收集到一起。',
  },
} as const

function App() {
  const [problemId, setProblemId] = useState<ProblemId>(1)
  const content = problemContent[problemId]
  const switchProblem = (id: ProblemId) => {
    setProblemId(id)
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)
  }

  return (
    <div id="top">
      <header className="site-header shell">
        <Logo />
        <nav aria-label="页面导航"><a href="#problem">题目</a><a href="#visualizer">动画</a></nav>
        <span className="problem-count"><b>{content.number}</b> / 100</span>
      </header>

      <main>
        <section className="problem-intro shell" id="problem">
          <aside className="problem-index" aria-hidden="true">{content.number}</aside>
          <div className="problem-copy">
            <div className="problem-tags"><span className={problemId === 2 ? 'medium' : ''}>{content.difficulty}</span>{content.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h1>{content.title}</h1>
            <p className="problem-lead">{content.lead}</p>
            <p className="problem-note">{content.note}</p>
            <div className="example-line"><span>示例</span>{content.example}</div>
            <a className="jump-link" href="#visualizer">看它如何找到答案 <ArrowDown size={16} /></a>
          </div>
        </section>

        <section className="visualizer-section" id="visualizer">
          <div className="shell">
            <div className="section-heading">
              <div><span className="eyebrow">ALGORITHM PLAYER</span><h2>{content.heading}</h2></div>
              <p>{content.description}</p>
            </div>
            {problemId === 1 ? <TwoSumVisualizer /> : <GroupAnagramsVisualizer />}
          </div>
        </section>

        <nav className="problem-pagination shell" aria-label="题目翻页">
          {problemId === 1
            ? <span className="previous disabled"><ArrowLeft size={17} /> 上一题</span>
            : <button className="previous" onClick={() => switchProblem(1)}><ArrowLeft size={17} /> 01 · 两数之和</button>}
          {problemId === 1
            ? <button className="next-problem" onClick={() => switchProblem(2)}><span><small>NEXT PROBLEM · 49</small><b>字母异位词分组</b></span><ArrowRight size={22} /></button>
            : <span className="next-problem disabled" aria-disabled="true"><span><small>NEXT PROBLEM</small><b>下一题待添加</b></span><ArrowRight size={22} /></span>}
        </nav>
      </main>

      <footer className="site-footer shell">
        <Logo /><p>题目与解法参考力扣官方题解</p><a href="https://leetcode.cn/problems/group-anagrams/" target="_blank" rel="noreferrer" aria-label="查看力扣题目"><Code2 size={18} /></a>
      </footer>
    </div>
  )
}

export default App

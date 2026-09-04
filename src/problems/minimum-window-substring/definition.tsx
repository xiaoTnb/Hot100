import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const minimumWindowSubstringProblem = {
  slug: 'minimum-window-substring',
  number: '12',
  leetcodeId: 'LeetCode #76',
  title: '最小覆盖子串',
  difficulty: 'hard',
  difficultyLabel: '困难',
  tags: ['哈希表', '字符串', '滑动窗口'],
  url: 'https://leetcode.cn/problems/minimum-window-substring/',
  lead: <>在字符串 <code>s</code> 中寻找包含字符串 <code>t</code> 全部字符的最短连续子串，重复字符也必须满足数量。</>,
  note: '“涵盖”表示窗口中每个目标字符的数量都不少于 t。例如 t = “AABC” 时，窗口必须至少包含两个 A、一个 B 和一个 C，只有字母种类相同还不够。',
  example: <><code>s = "ADOBECODEBANC"，t = "ABC"</code><strong>→ "BANC"</strong></>,
  Visualizer: lazy(() => import('./MinimumWindowSubstringVisualizer').then((module) => ({ default: module.MinimumWindowSubstringVisualizer }))),
} satisfies ProblemDefinition

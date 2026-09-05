import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const findAnagramsProblem = {
  slug: 'find-all-anagrams-in-a-string',
  number: '09',
  leetcodeId: 'LeetCode #438',
  title: '找到字符串中所有字母异位词',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['哈希表', '字符串', '滑动窗口'],
  languages: ['java', 'javascript'],
  url: 'https://leetcode.cn/problems/find-all-anagrams-in-a-string/',
  lead: <>在字符串 <code>s</code> 中找到所有字符串 <code>p</code> 的异位词子串，返回这些子串的起始下标。</>,
  note: '异位词子串，是从 s 中连续截取的一段字符串：它与 p 长度相同、每个字母的出现次数也完全相同，但排列顺序可以不同。例如 “cba” 是 “abc” 的异位词子串，“ca” 不是。',
  example: <><code>s = "cbaebabacd"，p = "abc"</code><strong>→ [0, 6]</strong></>,
  Visualizer: lazy(() => import('./FindAnagramsVisualizer').then((module) => ({ default: module.FindAnagramsVisualizer }))),
} satisfies ProblemDefinition

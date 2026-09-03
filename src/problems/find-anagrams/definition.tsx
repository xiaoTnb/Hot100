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
  url: 'https://leetcode.cn/problems/find-all-anagrams-in-a-string/',
  lead: <>在字符串 <code>s</code> 中找到所有字符串 <code>p</code> 的异位词子串，返回这些子串的起始下标。</>,
  note: '定长滑窗逐个比较长度为 p.length 的窗口；不定长滑窗把 cnt 当作字母配额，某个配额变负时持续右移 left。',
  example: <><code>s = "cbaebabacd"，p = "abc"</code><strong>→ [0, 6]</strong></>,
  Visualizer: lazy(() => import('./FindAnagramsVisualizer').then((module) => ({ default: module.FindAnagramsVisualizer }))),
} satisfies ProblemDefinition

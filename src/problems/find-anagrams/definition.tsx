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
  note: '窗口长度固定为 p.length。方法一比较两张 26 位计数表；方法二维护“窗口计数减 p 计数”的差值和 differ。',
  example: <><code>s = "cbaebabacd"，p = "abc"</code><strong>→ [0, 6]</strong></>,
  Visualizer: lazy(() => import('./FindAnagramsVisualizer').then((module) => ({ default: module.FindAnagramsVisualizer }))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const longestSubstringProblem = {
  slug: 'longest-substring-without-repeating-characters',
  number: '08',
  leetcodeId: 'LeetCode #3',
  title: '无重复字符的最长子串',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['哈希表', '字符串', '滑动窗口'],
  url: 'https://leetcode.cn/problems/longest-substring-without-repeating-characters/',
  lead: <>找出字符串 <code>s</code> 中不含重复字符的最长子串，并返回它的长度。</>,
  note: '窗口必须连续。right 加入新字符；一旦重复，left 就持续右移。可用 128 位整型计数数组或布尔数组记录 ASCII 字符。',
  example: <><code>s = "abcabcbb"</code><strong>最长长度：3（例如 "abc"）</strong></>,
  Visualizer: lazy(() => import('./LongestSubstringVisualizer').then((module) => ({ default: module.LongestSubstringVisualizer }))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const groupAnagramsProblem = {
  slug: 'group-anagrams',
  number: '02',
  leetcodeId: 'LeetCode #49',
  title: '字母异位词分组',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['哈希表', '字符串'],
  url: 'https://leetcode.cn/problems/group-anagrams/',
  lead: <>给你一个字符串数组，请将字母异位词组合在一起。结果列表可以按任意顺序返回。</>,
  note: '字母异位词包含完全相同的字母，只是排列顺序不同。',
  example: <><code>strs = ["eat", "tea", "tan", "ate", "nat", "bat"]</code><strong>→ [["eat", "tea", "ate"], ...]</strong></>,
  Visualizer: lazy(() => import('./GroupAnagramsVisualizer').then((module) => ({ default: module.GroupAnagramsVisualizer }))),
} satisfies ProblemDefinition

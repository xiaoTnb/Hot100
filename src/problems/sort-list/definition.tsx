import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const sortListProblem = {
  slug: 'sort-list',
  number: '33',
  leetcodeId: 'LeetCode #148',
  title: '排序链表',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['链表', '归并排序'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/sort-list/',
  lead: <>将单链表按升序排列并返回，要求整体时间复杂度达到 <code>O(n log n)</code>。</>,
  note: '自顶向下用快慢指针断链并递归归并，代码直观；自底向上从 step=1 开始合并相邻子链，逐轮倍增到 step≥n，避免递归栈，把额外空间降到 O(1)。',
  example: <><code>head = [4, 2, 1, 3]</code><strong>→ [1, 2, 3, 4]</strong></>,
  Visualizer: lazy(() => import('./SortListVisualizer').then((module) => ({ default: module.SortListVisualizer }))),
} satisfies ProblemDefinition

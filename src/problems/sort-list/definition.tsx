import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const sortListProblem = {
  slug: 'sort-list',
  number: '37',
  leetcodeId: 'LeetCode #148',
  title: '排序链表',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['链表', '归并排序'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/sort-list/',
  lead: <>将单链表按升序排列并返回，要求整体时间复杂度达到 <code>O(n log n)</code>。</>,
  note: '快慢指针找到中点并断链，递归排序左右两半，再用双指针合并。动画沿递归树先向下拆分，再沿相反方向逐层归并。',
  example: <><code>head = [4, 2, 1, 3]</code><strong>→ [1, 2, 3, 4]</strong></>,
  Visualizer: lazy(() => import('./SortListVisualizer').then((module) => ({ default: module.SortListVisualizer }))),
} satisfies ProblemDefinition

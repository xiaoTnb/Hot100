import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const mergeIntervalsProblem = {
  slug: 'merge-intervals',
  number: '14',
  leetcodeId: 'LeetCode #56',
  title: '合并区间',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '排序'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/merge-intervals/',
  lead: <>合并所有重叠区间，返回一组互不重叠并且恰好覆盖原输入的区间。</>,
  note: '先按左端点排序。扫描时只需比较当前区间与答案末尾区间：发生重叠就延长右端点，否则追加一个新区间。',
  example: <><code>intervals = [[1,3], [2,6], [8,10], [15,18]]</code><strong>→ [[1,6], [8,10], [15,18]]</strong></>,
  Visualizer: lazy(() => import('./MergeIntervalsVisualizer').then((module) => ({ default: module.MergeIntervalsVisualizer }))),
} satisfies ProblemDefinition

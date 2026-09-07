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
  languages: ['java'],
  url: 'https://leetcode.cn/problems/merge-intervals/',
  lead: <>合并所有重叠区间，返回一组互不重叠并且恰好覆盖原输入的区间。</>,
  note: '四个动画对照两种排序写法、差分数组与扫描线。排序法直接判断区间是否断开；另外两种方法把端点变成事件，再观察覆盖计数何时从 0 开始、何时回到 0。',
  example: <><code>intervals = [[1,6], [2,3], [8,10], [9,12], [15,18]]</code><strong>→ [[1,6], [8,12], [15,18]]</strong></>,
  Visualizer: lazy(() => import('./MergeIntervalsVisualizer').then((module) => ({ default: module.MergeIntervalsVisualizer }))),
} satisfies ProblemDefinition

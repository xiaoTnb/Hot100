import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const findMinimumRotatedArrayProblem = {
  slug: 'find-minimum-rotated-array',
  number: '30',
  leetcodeId: 'LeetCode #153',
  title: '寻找旋转排序数组中的最小值',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '二分查找'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/',
  lead: <>在元素互不相同的旋转升序数组中，使用 <code>O(log n)</code> 算法找出最小元素。</>,
  note: '末尾元素天然位于最小值所在的右侧有序段。中点小于末尾值时保留中点并收缩右边界，否则中点一定在左侧大值段，移动左边界。',
  example: <><code>nums = [3,4,5,1,2]</code><strong>→ 1</strong></>,
  Visualizer: lazy(() => import('./FindMinimumRotatedArrayVisualizer').then((module) => ({ default: module.FindMinimumRotatedArrayVisualizer }))),
} satisfies ProblemDefinition

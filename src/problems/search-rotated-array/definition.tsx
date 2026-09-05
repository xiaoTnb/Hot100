import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const searchRotatedArrayProblem = {
  slug: 'search-rotated-array',
  number: '29',
  leetcodeId: 'LeetCode #33',
  title: '搜索旋转排序数组',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '二分查找'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/search-in-rotated-sorted-array/',
  lead: <>在元素互不相同的旋转升序数组中查找 <code>target</code>，存在时返回下标，否则返回 <code>-1</code>。</>,
  note: '先用一次二分找到最小值（旋转点），数组就被切成两段各自有序的区间；再判断 target 属于哪一段，并在该段做 lowerBound。',
  example: <><code>nums = [4,5,6,7,0,1,2]，target = 0</code><strong>→ 4</strong></>,
  Visualizer: lazy(() => import('./SearchRotatedArrayVisualizer').then((module) => ({ default: module.SearchRotatedArrayVisualizer }))),
} satisfies ProblemDefinition

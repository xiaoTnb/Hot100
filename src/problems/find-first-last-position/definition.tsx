import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const findFirstLastPositionProblem = {
  slug: 'find-first-last-position',
  number: '28',
  leetcodeId: 'LeetCode #34',
  title: '在排序数组中查找元素的第一个和最后一个位置',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '二分查找'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/',
  lead: <>在非递减数组中找出 <code>target</code> 的开始与结束位置；不存在时返回 <code>[-1, -1]</code>。</>,
  note: '复用 lowerBound 两次：第一次找第一个 ≥ target 的位置；第二次找第一个 ≥ target + 1 的位置，再减一得到最后一个 target。',
  example: <><code>nums = [5,7,7,8,8,10]，target = 8</code><strong>→ [3,4]</strong></>,
  Visualizer: lazy(() => import('./FindFirstLastPositionVisualizer').then((module) => ({ default: module.FindFirstLastPositionVisualizer }))),
} satisfies ProblemDefinition

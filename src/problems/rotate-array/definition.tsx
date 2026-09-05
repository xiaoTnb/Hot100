import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const rotateArrayProblem = {
  slug: 'rotate-array',
  number: '15',
  leetcodeId: 'LeetCode #189',
  title: '轮转数组',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '双指针'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/rotate-array/',
  lead: <>将数组中的元素向右轮转 <code>k</code> 个位置，要求直接修改原数组。</>,
  note: '三次反转可以原地完成轮转：整体反转把末尾元素带到前面，再分别恢复前 k 段和剩余段内部的顺序。',
  example: <><code>nums = [1,2,3,4,5,6,7]，k = 3</code><strong>→ [5,6,7,1,2,3,4]</strong></>,
  Visualizer: lazy(() => import('./RotateArrayVisualizer').then((module) => ({ default: module.RotateArrayVisualizer }))),
} satisfies ProblemDefinition

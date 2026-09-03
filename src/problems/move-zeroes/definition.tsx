import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const moveZeroesProblem = {
  slug: 'move-zeroes',
  number: '04',
  leetcodeId: 'LeetCode #283',
  title: '移动零',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['数组', '双指针'],
  url: 'https://leetcode.cn/problems/move-zeroes/',
  lead: <>将数组中的所有 <code>0</code> 原地移动到末尾，同时保持所有非零元素的相对顺序。</>,
  note: '不能复制数组。left 指向已处理区的末尾，right 负责寻找下一个非零数；找到后交换并推进 left。',
  example: <><code>nums = [2, 0, 1, 0, 3, 12]</code><strong>→ [2, 1, 3, 12, 0, 0]</strong></>,
  Visualizer: lazy(() => import('./MoveZeroesVisualizer').then((module) => ({ default: module.MoveZeroesVisualizer }))),
} satisfies ProblemDefinition

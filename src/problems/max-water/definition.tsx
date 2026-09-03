import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const maxWaterProblem = {
  slug: 'container-with-most-water',
  number: '05',
  leetcodeId: 'LeetCode #11',
  title: '盛最多水的容器',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '双指针'],
  url: 'https://leetcode.cn/problems/container-with-most-water/',
  lead: <>选择两条垂线与 x 轴组成容器，返回它能够储存的最大水量；容器不能倾斜。</>,
  note: '容量 = 较短边 × 两边距离。移动较高边只会缩短宽度且无法抬高水面，所以每次淘汰较短的一边。',
  example: <><code>height = [1, 8, 6, 2, 5, 4, 8, 3, 7]</code><strong>最大水量：49</strong></>,
  Visualizer: lazy(() => import('./MaxWaterVisualizer').then((module) => ({ default: module.MaxWaterVisualizer }))),
} satisfies ProblemDefinition

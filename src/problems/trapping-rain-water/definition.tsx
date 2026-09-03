import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const trappingRainWaterProblem = {
  slug: 'trapping-rain-water',
  number: '07',
  leetcodeId: 'LeetCode #42',
  title: '接雨水',
  difficulty: 'hard',
  difficultyLabel: '困难',
  tags: ['数组', '动态规划', '单调栈', '双指针'],
  url: 'https://leetcode.cn/problems/trapping-rain-water/',
  lead: <>给定每根宽度为 <code>1</code> 的柱子高度，计算下雨后这些柱子之间一共能接多少单位雨水。</>,
  note: '同一个示例提供三种动画：预处理左右最高柱、单调栈逐层填坑、双指针从较低一侧结算。',
  example: <><code>height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]</code><strong>接到 6 个单位雨水</strong></>,
  Visualizer: lazy(() => import('./TrappingRainWaterVisualizer').then((module) => ({ default: module.TrappingRainWaterVisualizer }))),
} satisfies ProblemDefinition

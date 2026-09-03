import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const threeSumProblem = {
  slug: 'three-sum',
  number: '06',
  leetcodeId: 'LeetCode #15',
  title: '三数之和',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '双指针', '排序'],
  url: 'https://leetcode.cn/problems/3sum/',
  lead: <>找出数组中所有和为 <code>0</code> 且不重复的三元组，三个元素必须来自不同下标。</>,
  note: '先排序，再固定第一个数 a。第二个数 b 从左向右枚举，第三个数 c 从右向左移动；相邻重复值直接跳过。',
  example: <><code>nums = [-1, 0, 1, 2, -1, -4]</code><strong>→ [[-1, -1, 2], [-1, 0, 1]]</strong></>,
  Visualizer: lazy(() => import('./ThreeSumVisualizer').then((module) => ({ default: module.ThreeSumVisualizer }))),
} satisfies ProblemDefinition

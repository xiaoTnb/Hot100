import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const firstMissingPositiveProblem = {
  slug: 'first-missing-positive',
  number: '17',
  leetcodeId: 'LeetCode #41',
  title: '缺失的第一个正数',
  difficulty: 'hard',
  difficultyLabel: '困难',
  tags: ['数组', '哈希思想', '原地交换'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/first-missing-positive/',
  lead: <>找出数组中没有出现的最小正整数，要求时间复杂度 O(n)，并且只使用常数额外空间。</>,
  note: '把数组本身当作哈希表：数字 x 应放在下标 x−1。动画把下标画成座位，把数值画成学号，并单独展示越界值与重复值为何不交换。',
  example: <><code>nums = [3, 4, -1, 1]</code><strong>→ 2</strong></>,
  Visualizer: lazy(() => import('./FirstMissingPositiveVisualizer').then((module) => ({ default: module.FirstMissingPositiveVisualizer }))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const twoSumProblem = {
  slug: 'two-sum',
  number: '01',
  leetcodeId: 'LeetCode #1',
  title: '两数之和',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['数组', '哈希表'],
  url: 'https://leetcode.cn/problems/two-sum/',
  lead: <>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请找出和为目标值的两个整数，并返回它们的数组下标。</>,
  note: '每种输入只会对应一个答案，且同一个元素不能重复使用。答案可以按任意顺序返回。',
  example: <><code>nums = [2, 11, 7, 15]</code><code>target = 9</code><strong>→ [0, 2]</strong></>,
  Visualizer: lazy(() => import('./TwoSumVisualizer').then((module) => ({ default: module.TwoSumVisualizer }))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const searchInsertPositionProblem = {
  slug: 'search-insert-position',
  number: '26',
  leetcodeId: 'LeetCode #35',
  title: '搜索插入位置',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['数组', '二分查找'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/search-insert-position/',
  lead: <>在升序数组中查找 <code>target</code>；存在时返回下标，否则返回它按顺序插入的位置。</>,
  note: '答案等价于第一个大于等于 target 的下标。用开区间 (left, right) 维护：left 一侧都小于 target，right 一侧都大于等于 target。',
  example: <><code>nums = [1,3,5,6]，target = 5</code><strong>→ 2</strong></>,
  Visualizer: lazy(() => import('./SearchInsertPositionVisualizer').then((module) => ({ default: module.SearchInsertPositionVisualizer }))),
} satisfies ProblemDefinition

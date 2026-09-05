import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const search2dMatrixProblem = {
  slug: 'search-2d-matrix',
  number: '27',
  leetcodeId: 'LeetCode #74',
  title: '搜索二维矩阵',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '二分查找', '矩阵'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/search-a-2d-matrix/',
  lead: <>在每行递增、且下一行首元素大于上一行末元素的矩阵中判断 <code>target</code> 是否存在。</>,
  note: '矩阵整体可以看成一段有序的一维数组。线性下标 mid 映射为行 ⌊mid / 列数⌋、列 mid % 列数，无需真的展开矩阵。',
  example: <><code>matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]，target = 3</code><strong>→ true</strong></>,
  Visualizer: lazy(() => import('./Search2dMatrixVisualizer').then((module) => ({ default: module.Search2dMatrixVisualizer }))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const setMatrixZeroesProblem = {
  slug: 'set-matrix-zeroes', number: '18', leetcodeId: 'LeetCode #73', title: '矩阵置零', difficulty: 'medium', difficultyLabel: '中等', tags: ['矩阵', '数组', '原地算法'], languages: ['java'], url: 'https://leetcode.cn/problems/set-matrix-zeroes/',
  lead: <>矩阵中只要一个元素为 <code>0</code>，就把它所在的整行和整列设为 0，并原地修改矩阵。</>,
  note: '扫描阶段只能记录原始 0 的位置，不能立刻清零。常量空间方法把第一行和第一列复用为标记栏，并用两个布尔值保存它们最初是否含 0。',
  example: <><code>[[1,1,1],[1,0,1],[1,1,1]]</code><strong>→ [[1,0,1],[0,0,0],[1,0,1]]</strong></>,
  Visualizer: lazy(() => import('./SetMatrixZeroesVisualizer').then((module) => ({ default: module.SetMatrixZeroesVisualizer }))),
} satisfies ProblemDefinition

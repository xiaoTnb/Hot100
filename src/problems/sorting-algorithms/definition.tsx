import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const sortingAlgorithmsProblem = {
  slug: 'sorting-algorithms',
  number: '47',
  leetcodeId: '排序专题',
  title: '八种常见排序',
  difficulty: 'medium',
  difficultyLabel: '专题',
  tags: ['数组', '排序', '动画'],
  languages: ['javascript'],
  url: '',
  lead: <>用同一组数字观察冒泡、选择、插入、快速、归并、堆、计数和基数排序。点击算法后可播放或逐步查看。</>,
  note: '蓝色表示正在比较或处理，橙色表示基准或当前写入位置，绿色表示已经确定顺序。带重复值的样例可用来观察稳定排序如何保留相同元素的原始次序。',
  example: <><code>[12, 24, 12, 23, 31, 11, 22]</code><strong>→ [11, 12, 12, 22, 23, 24, 31]</strong></>,
  Visualizer: lazy(() => import('./SortingAlgorithmsVisualizer').then((module) => ({ default: module.SortingAlgorithmsVisualizer }))),
} satisfies ProblemDefinition

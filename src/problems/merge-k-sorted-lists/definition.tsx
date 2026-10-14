import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const mergeKSortedListsProblem = {
  slug: 'merge-k-sorted-lists',
  number: '34',
  leetcodeId: 'LeetCode #23',
  title: '合并 K 个升序链表',
  difficulty: 'hard',
  difficultyLabel: '困难',
  tags: ['链表', '分治', '堆'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/merge-k-sorted-lists/',
  lead: <>将 <code>k</code> 个升序链表合并成一条升序链表并返回。</>,
  note: '最小堆始终只保存每条链表当前的头节点；分治则把 K 条链表两两归并。递归版按区间二分，迭代版让 step 从 1 开始倍增。',
  example: <><code>lists = [[1,4,5],[1,3,4],[2,6]]</code><strong>→ [1,1,2,3,4,4,5,6]</strong></>,
  Visualizer: lazy(() => import('./MergeKSortedListsVisualizer').then((module) => ({ default: module.MergeKSortedListsVisualizer }))),
} satisfies ProblemDefinition

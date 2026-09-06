import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const mergeTwoSortedListsProblem = {
  slug: 'merge-two-sorted-lists',
  number: '35',
  leetcodeId: 'LeetCode #21',
  title: '合并两个有序链表',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['链表', '双指针'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/merge-two-sorted-lists/',
  lead: <>将两个升序链表合并为一个新的升序链表，并返回合并后的链表头节点。</>,
  note: '用 dummy 消除头节点的边界判断。每轮比较两个链表的当前节点，把较小者接到 cur 后方；某条链表耗尽后，直接接上另一条的剩余部分。',
  example: <><code>l1 = [1, 2, 4]，l2 = [1, 3, 4]</code><strong>→ [1, 1, 2, 3, 4, 4]</strong></>,
  Visualizer: lazy(() => import('./MergeTwoSortedListsVisualizer').then((module) => ({ default: module.MergeTwoSortedListsVisualizer }))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const mergeTwoSortedListsProblem = {
  slug: 'merge-two-sorted-lists',
  number: '27',
  leetcodeId: 'LeetCode #21',
  title: '合并两个有序链表',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['链表', '双指针'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/merge-two-sorted-lists/',
  lead: <>将两个升序链表合并为一个新的升序链表，并返回合并后的链表头节点。</>,
  note: '迭代法用 dummy 消除头节点分支，每轮把较小节点尾插到 cur；递归法选择较小头节点，再让它的 next 指向剩余链表的递归合并结果。',
  example: <><code>l1 = [1, 2, 4]，l2 = [1, 3, 4]</code><strong>→ [1, 1, 2, 3, 4, 4]</strong></>,
  Visualizer: lazy(() => import('./MergeTwoSortedListsVisualizer').then((module) => ({ default: module.MergeTwoSortedListsVisualizer }))),
} satisfies ProblemDefinition

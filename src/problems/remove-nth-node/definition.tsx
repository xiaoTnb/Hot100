import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const removeNthNodeProblem = {
  slug: 'remove-nth-node-from-end-of-list',
  number: '34',
  leetcodeId: 'LeetCode #19',
  title: '删除链表的倒数第 N 个结点',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['链表', '双指针'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/remove-nth-node-from-end-of-list/',
  lead: <>删除链表的倒数第 <code>n</code> 个结点，并返回删除后的头节点。</>,
  note: '用 dummy 处理删除头节点的边界。fast 先走 n 步，再与 slow 同步移动；当 fast 到达尾节点时，slow.next 正好是要删除的节点。',
  example: <><code>head = [1, 2, 3, 4, 5]，n = 2</code><strong>→ [1, 2, 3, 5]</strong></>,
  Visualizer: lazy(() => import('./RemoveNthNodeVisualizer').then((module) => ({ default: module.RemoveNthNodeVisualizer }))),
} satisfies ProblemDefinition

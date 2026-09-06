import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const linkedListCycleIIProblem = {
  slug: 'linked-list-cycle-ii',
  number: '34',
  leetcodeId: 'LeetCode #142',
  title: '环形链表 II',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['链表', '快慢指针'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/linked-list-cycle-ii/',
  lead: <>给定链表头节点 <code>head</code>，返回链表开始入环的第一个节点；若无环则返回 <code>null</code>。</>,
  note: 'Floyd 算法分两阶段：先用快慢指针在环内相遇，再让一个指针回到 head。两个指针同速前进后的相遇处，就是环入口，全程不修改链表。',
  example: <><code>head = [3, 2, 0, -4]，pos = 1</code><strong>→ index 1</strong></>,
  Visualizer: lazy(() => import('./LinkedListCycleIIVisualizer').then((module) => ({ default: module.LinkedListCycleIIVisualizer }))),
} satisfies ProblemDefinition

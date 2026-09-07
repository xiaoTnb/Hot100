import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const intersectionLinkedListProblem = {
  slug: 'intersection-of-two-linked-lists',
  number: '22',
  leetcodeId: 'LeetCode #160',
  title: '相交链表',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['链表', '双指针'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/intersection-of-two-linked-lists/',
  lead: <>给定两个单链表的头节点 <code>headA</code> 和 <code>headB</code>，找出并返回两个链表相交的起始节点；不存在交点时返回 <code>null</code>。</>,
  note: '让两个指针分别走 A → B 与 B → A。换轨会抵消两条链表独有部分的长度差，因此它们会在交点相遇；若不相交，则同时抵达 null。链表原始结构不会被修改。',
  example: <><code>A = [4, 1, 8, 4, 5]，B = [5, 6, 1, 8, 4, 5]</code><strong>→ Intersected at 8</strong></>,
  Visualizer: lazy(() => import('./IntersectionLinkedListVisualizer').then((module) => ({ default: module.IntersectionLinkedListVisualizer }))),
} satisfies ProblemDefinition

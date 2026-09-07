import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const palindromeLinkedListProblem = {
  slug: 'palindrome-linked-list',
  number: '24',
  leetcodeId: 'LeetCode #234',
  title: '回文链表',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['链表', '双指针'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/palindrome-linked-list/',
  lead: <>给定单链表的头节点 <code>head</code>，判断这个链表是否为回文链表。</>,
  note: '递归法让 right 先到末尾，归程与从表头右移的 left 比较；另一种方法用快慢指针找到中点，原地反转后半段再逐对比较，把额外空间降到 O(1)。',
  example: <><code>head = [1, 2, 2, 1]</code><strong>→ true</strong></>,
  Visualizer: lazy(() => import('./PalindromeLinkedListVisualizer').then((module) => ({ default: module.PalindromeLinkedListVisualizer }))),
} satisfies ProblemDefinition

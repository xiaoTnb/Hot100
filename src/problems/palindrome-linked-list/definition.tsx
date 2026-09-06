import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const palindromeLinkedListProblem = {
  slug: 'palindrome-linked-list',
  number: '32',
  leetcodeId: 'LeetCode #234',
  title: '回文链表',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['链表', '双指针'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/palindrome-linked-list/',
  lead: <>给定单链表的头节点 <code>head</code>，判断这个链表是否为回文链表。</>,
  note: '快慢指针先找到后半段起点；原地反转后半段，再从两端对应位置向中间比较。动画把“定位、反转、比较”拆成三个清晰阶段。',
  example: <><code>head = [1, 2, 2, 1]</code><strong>→ true</strong></>,
  Visualizer: lazy(() => import('./PalindromeLinkedListVisualizer').then((module) => ({ default: module.PalindromeLinkedListVisualizer }))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const addTwoNumbersProblem = {
  slug: 'add-two-numbers',
  number: '36',
  leetcodeId: 'LeetCode #2',
  title: '两数相加',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['链表', '数学'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/add-two-numbers/',
  lead: <>两个非空链表以逆序保存非负整数的每一位。逐位相加，并以相同的链表形式返回它们的和。</>,
  note: '同时遍历两条链表并维护进位 carry。当前节点保存 sum % 10，下一轮进位是 floor(sum / 10)；任一链表未结束或仍有进位时都要继续。',
  example: <><code>l1 = [2, 4, 3]，l2 = [5, 6, 4]</code><strong>→ [7, 0, 8]</strong></>,
  Visualizer: lazy(() => import('./AddTwoNumbersVisualizer').then((module) => ({ default: module.AddTwoNumbersVisualizer }))),
} satisfies ProblemDefinition

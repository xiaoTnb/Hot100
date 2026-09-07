import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const linkedListCycleProblem = {
  slug: 'linked-list-cycle',
  number: '25',
  leetcodeId: 'LeetCode #141',
  title: '环形链表',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['链表', '快慢指针'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/linked-list-cycle/',
  lead: <>给定链表头节点 <code>head</code>，判断链表中是否存在通过连续跟踪 <code>next</code> 再次到达的环。</>,
  note: 'slow 每轮走一步，fast 每轮走两步。有环时 fast 会在环内追上 slow；判断 fast == slow 比较的是两个节点引用是否相同，不是节点值 val 是否相等。',
  example: <><code>head = [3, 2, 0, -4]，pos = 1</code><strong>→ true</strong></>,
  Visualizer: lazy(() => import('./LinkedListCycleVisualizer').then((module) => ({ default: module.LinkedListCycleVisualizer }))),
} satisfies ProblemDefinition

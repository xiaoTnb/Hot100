import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const linkedListCycleProblem = {
  slug: 'linked-list-cycle',
  number: '33',
  leetcodeId: 'LeetCode #141',
  title: '环形链表',
  difficulty: 'easy',
  difficultyLabel: '简单',
  tags: ['链表', '快慢指针'],
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/linked-list-cycle/',
  lead: <>给定链表头节点 <code>head</code>，判断链表中是否存在通过连续跟踪 <code>next</code> 再次到达的环。</>,
  note: 'slow 每轮走一步，fast 每轮走两步。若链表有环，fast 会在环内从后方追上 slow；若无环，fast 会先抵达 null。',
  example: <><code>head = [3, 2, 0, -4]，pos = 1</code><strong>→ true</strong></>,
  Visualizer: lazy(() => import('./LinkedListCycleVisualizer').then((module) => ({ default: module.LinkedListCycleVisualizer }))),
} satisfies ProblemDefinition

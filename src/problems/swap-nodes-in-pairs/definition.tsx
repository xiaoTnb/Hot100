import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const swapNodesInPairsProblem = {
  slug: 'swap-nodes-in-pairs', number: '38', leetcodeId: 'LeetCode #24', title: '两两交换链表中的节点', difficulty: 'medium', difficultyLabel: '中等', tags: ['链表', '模拟'], languages: ['javascript'], url: 'https://leetcode.cn/problems/swap-nodes-in-pairs/',
  lead: <>两两交换链表中相邻的节点，并返回交换后的头节点；不能修改节点内部的值。</>,
  note: 'dummy 让每一组都有稳定前驱 cur。保存 l1、l2 后依次重连 cur.next、l1.next、l2.next，再把 cur 移到本组尾部 l1。',
  example: <><code>head = [1, 2, 3, 4]</code><strong>→ [2, 1, 4, 3]</strong></>,
  Visualizer: lazy(() => import('./SwapNodesInPairsVisualizer').then((module) => ({ default: module.SwapNodesInPairsVisualizer }))),
} satisfies ProblemDefinition

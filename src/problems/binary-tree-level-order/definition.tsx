import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const binaryTreeLevelOrderProblem = {
  slug: 'binary-tree-level-order-traversal', number: '40', leetcodeId: 'LeetCode #102', title: '二叉树的层序遍历',
  difficulty: 'medium', difficultyLabel: '中等', tags: ['二叉树', 'BFS', '队列'], languages: ['java'],
  url: 'https://leetcode.cn/problems/binary-tree-level-order-traversal/',
  lead: <>逐层、从左到右遍历二叉树，返回每一层的节点值列表。</>,
  note: '两个数组用 cur 和 nxt 隔开本层与下层；单队列在每层开始保存 n=q.size()，本轮只取 n 个节点，新加入的孩子留到下一层。Java 思路参考：灵茶山艾府。',
  example: <><code>root = [3,9,20,null,null,15,7]</code><strong>→ [[3],[9,20],[15,7]]</strong></>,
  Visualizer: lazy(() => import('./Visualizer').then(m => ({ default: m.BinaryTreeLevelOrderVisualizer }))),
} satisfies ProblemDefinition

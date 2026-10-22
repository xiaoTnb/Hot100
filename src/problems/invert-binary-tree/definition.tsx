import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const invertBinaryTreeProblem = {
  slug: 'invert-binary-tree', number: '37', leetcodeId: 'LeetCode #226', title: '翻转二叉树',
  difficulty: 'easy', difficultyLabel: '简单', tags: ['二叉树', '递归'], languages: ['java'],
  url: 'https://leetcode.cn/problems/invert-binary-tree/',
  lead: <>翻转二叉树的每一个节点的左右子树，并返回根节点 <code>root</code>。</>,
  note: '可以先递归翻转两棵子树，再交换孩子；也可以先交换孩子，再递归处理。暂存变量用于保留原左孩子。Java 思路参考：灵茶山艾府。',
  example: <><code>root = [4,2,7,1,3,6,9]</code><strong>→ [4,7,2,9,6,3,1]</strong></>,
  Visualizer: lazy(() => import('./Visualizer').then(m => ({ default: m.InvertBinaryTreeVisualizer }))),
} satisfies ProblemDefinition

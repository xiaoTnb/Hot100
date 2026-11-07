import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const maximumDepthBinaryTreeProblem = {
  slug: 'maximum-depth-of-binary-tree', number: '37', leetcodeId: 'LeetCode #104', title: '二叉树的最大深度',
  difficulty: 'easy', difficultyLabel: '简单', tags: ['二叉树', '递归', '深度优先搜索'], languages: ['java'],
  url: 'https://leetcode.cn/problems/maximum-depth-of-binary-tree/',
  lead: <>返回从根节点到最远叶子节点的路径上的节点数。空树深度为 0，只有根节点时深度为 1。</>,
  note: '自底向上先求左右子树深度，返回较大值加 1；自顶向下把当前深度传给孩子，并更新 ans。两种方法都展示递归进入、暂停等待和逐层返回。Java 思路参考：灵茶山艾府。',
  example: <><code>root = [3,9,20,null,null,15,7]</code><strong>→ 3</strong></>,
  Visualizer: lazy(() => import('./Visualizer').then(m => ({ default: m.MaximumDepthBinaryTreeVisualizer }))),
} satisfies ProblemDefinition

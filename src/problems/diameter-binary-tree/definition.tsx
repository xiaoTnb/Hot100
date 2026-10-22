import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const diameterBinaryTreeProblem = {
  slug: 'diameter-of-binary-tree', number: '39', leetcodeId: 'LeetCode #543', title: '二叉树的直径',
  difficulty: 'easy', difficultyLabel: '简单', tags: ['二叉树', '树形 DP', '递归'], languages: ['java'],
  url: 'https://leetcode.cn/problems/diameter-of-binary-tree/',
  lead: <>返回任意两个节点之间最长路径的长度。长度按<em>边数</em>计算，路径可以不经过根节点。</>,
  note: '在每个节点用左右两条最长链更新 ans，但 dfs 只能返回一条最长链。两种写法分别以边长或子树高度定义返回值，动画分别展示空节点 -1 / 0 的意义。Java 思路参考：灵茶山艾府。',
  example: <><code>root = [1,2,3,4,5]</code><strong>→ 3</strong></>,
  Visualizer: lazy(() => import('./Visualizer').then(m => ({ default: m.DiameterBinaryTreeVisualizer }))),
} satisfies ProblemDefinition

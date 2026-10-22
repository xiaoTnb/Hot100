import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const symmetricTreeProblem = {
  slug: 'symmetric-tree', number: '38', leetcodeId: 'LeetCode #101', title: '对称二叉树',
  difficulty: 'easy', difficultyLabel: '简单', tags: ['二叉树', '递归', '镜像'], languages: ['java'],
  url: 'https://leetcode.cn/problems/symmetric-tree/',
  lead: <>判断二叉树是否轴对称。节点值相同还不够，它们所在的位置也必须互为镜像。</>,
  note: '比较 p、q 的值，再交叉比较 p.left / q.right 与 p.right / q.left。两个 null 匹配，单侧为 null 不匹配。递归思路参考：灵茶山艾府；另附队列迭代演示。',
  example: <><code>root = [1,2,2,3,4,4,3]</code><strong>→ true</strong></>,
  Visualizer: lazy(() => import('./Visualizer').then(m => ({ default: m.SymmetricTreeVisualizer }))),
} satisfies ProblemDefinition

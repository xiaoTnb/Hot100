import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const validateBSTProblem = {
  slug: 'validate-binary-search-tree', number: '42', leetcodeId: 'LeetCode #98', title: '验证二叉搜索树',
  difficulty: 'medium', difficultyLabel: '中等', tags: ['二叉树', '递归', '二叉搜索树'], languages: ['java'],
  url: 'https://leetcode.cn/problems/validate-binary-search-tree/',
  lead: <>判断每个节点是否满足：整个左子树的值严格小于它，整个右子树的值严格大于它。</>,
  note: '三种方法分别演示前序传递范围、中序检查严格递增、后序返回子树最小最大值。只比较直接孩子会漏掉违反祖先限制的节点。Java 用 long 哨兵处理 int 边界。思路参考：灵茶山艾府。',
  example: <><code>root = [2,1,3]</code><strong>→ true</strong></>,
  Visualizer: lazy(() => import('./Visualizer').then(m => ({ default: m.ValidateBSTVisualizer }))),
} satisfies ProblemDefinition

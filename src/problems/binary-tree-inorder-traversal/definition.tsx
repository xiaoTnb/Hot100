import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const binaryTreeInorderTraversalProblem = {
  slug:'binary-tree-inorder-traversal',
  number:'36',
  leetcodeId:'LeetCode #94',
  title:'二叉树的中序遍历',
  difficulty:'easy',
  difficultyLabel:'简单',
  tags:['树','深度优先搜索','Morris'],
  languages:['java'],
  url:'https://leetcode.cn/problems/binary-tree-inorder-traversal/',
  lead:<>返回二叉树节点值的中序遍历结果；访问顺序为 <code>左子树 → 根节点 → 右子树</code>。</>,
  note:'递归 DFS 按左、根、右访问；程序自动记录每层的执行位置，子调用返回后继续上一层，无需手动创建 Stack。Morris 遍历用临时线索回到根节点，使用后删除线索，恢复原树。',
  example:<><code>root = [1,null,2,3]</code><strong>→ [1,3,2]</strong></>,
  Visualizer:lazy(()=>import('./BinaryTreeInorderTraversalVisualizer').then(module=>({default:module.BinaryTreeInorderTraversalVisualizer}))),
} satisfies ProblemDefinition

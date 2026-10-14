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
  note:'递归 DFS 用调用栈保存返回位置。Morris 遍历把左子树最右节点临时连回当前根，借这条线索回到根节点；使用后必须删除线索，恢复原树。',
  example:<><code>root = [1,null,2,3]</code><strong>→ [1,3,2]</strong></>,
  Visualizer:lazy(()=>import('./BinaryTreeInorderTraversalVisualizer').then(module=>({default:module.BinaryTreeInorderTraversalVisualizer}))),
} satisfies ProblemDefinition

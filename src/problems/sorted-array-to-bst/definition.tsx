import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const sortedArrayToBSTProblem = {
  slug: 'convert-sorted-array-to-binary-search-tree', number: '41', leetcodeId: 'LeetCode #108', title: '将有序数组转换为二叉搜索树',
  difficulty: 'easy', difficultyLabel: '简单', tags: ['二叉树', '分治', '递归'], languages: ['java'],
  url: 'https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/',
  lead: <>将严格递增的数组 <code>nums</code> 转换成一棵高度平衡的二叉搜索树。</>,
  note: '选择中点作为根，再递归构造左右两半。使用 [left,right) 区间，空区间返回 null；偶数长度选中间偏右元素。为便于对应动画，把创建根与连接左右子树展开为多行 Java。思路参考：灵茶山艾府。',
  example: <><code>nums = [-10,-3,0,5,9]</code><strong>→ [0,-3,9,-10,null,5]</strong></>,
  Visualizer: lazy(() => import('./Visualizer').then(m => ({ default: m.SortedArrayToBSTVisualizer }))),
} satisfies ProblemDefinition

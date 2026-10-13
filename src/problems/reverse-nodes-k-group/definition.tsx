import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const reverseNodesKGroupProblem = {
  slug:'reverse-nodes-in-k-group', number:'31', leetcodeId:'LeetCode #25', title:'K 个一组翻转链表', difficulty:'hard', difficultyLabel:'困难', tags:['链表','分组反转'], languages:['java'], url:'https://leetcode.cn/problems/reverse-nodes-in-k-group/',
  lead:<>每 <code>k</code> 个节点为一组原地翻转链表；最后不足 k 个节点时保持原顺序。</>,
  note:'先统计节点数，保证只处理完整的 k 节点组。组内使用反转链表的 pre、cur、nxt 三指针；完成后把旧组头作为尾接向下一组，再让上一组尾连接新组头。',
  example:<><code>head = [1,2,3,4,5]，k = 2</code><strong>→ [2,1,4,3,5]</strong></>,
  Visualizer:lazy(()=>import('./ReverseNodesKGroupVisualizer').then(module=>({default:module.ReverseNodesKGroupVisualizer}))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const lruCacheProblem = {
  slug:'lru-cache', number:'41', leetcodeId:'LeetCode #146', title:'LRU 缓存（链表版）', difficulty:'medium', difficultyLabel:'中等', tags:['链表','哈希表'], languages:['javascript'], url:'https://leetcode.cn/problems/lru-cache/',
  lead:<>实现满足 LRU（最近最少使用）约束的缓存，使 <code>get</code> 和 <code>put</code> 的平均时间复杂度均为 O(1)。</>,
  note:'Map 负责 O(1) 查找，双向链表负责 O(1) 调整访问顺序。头部是最近使用，尾部是最久未使用；容量超限时淘汰尾节点。',
  example:<><code>capacity = 2；put(1,1), put(2,2), get(1), put(3,3)…</code><strong>→ [null,null,null,1,null,-1,…]</strong></>,
  Visualizer:lazy(()=>import('./LruCacheVisualizer').then((module)=>({default:module.LruCacheVisualizer}))),
} satisfies ProblemDefinition

import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const lruCacheProblem = {
  slug:'lru-cache', number:'35', leetcodeId:'LeetCode #146', title:'LRU 缓存', difficulty:'medium', difficultyLabel:'中等', tags:['链表','哈希表','设计'], languages:['java'], url:'https://leetcode.cn/problems/lru-cache/',
  lead:<>实现满足 LRU（最近最少使用）约束的缓存，使 <code>get</code> 和 <code>put</code> 的平均时间复杂度均为 O(1)。</>,
  note:'手写法用 Map 负责 O(1) 查找、循环双向链表维护 MRU→LRU 顺序，节点保存 key 以便淘汰时同步删除 Map；标准库写法使用 accessOrder=true 的 LinkedHashMap。',
  example:<><code>capacity = 2；put(1,1), put(2,2), get(1), put(3,3)…</code><strong>→ [null,null,null,1,null,-1,…]</strong></>,
  Visualizer:lazy(()=>import('./LruCacheVisualizer').then((module)=>({default:module.LruCacheVisualizer}))),
} satisfies ProblemDefinition

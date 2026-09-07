import { lazy } from 'react'
import type { ProblemDefinition } from '../types'
export const copyRandomListProblem = {
  slug:'copy-list-with-random-pointer', number:'36', leetcodeId:'LeetCode #138', title:'随机链表的复制', difficulty:'medium', difficultyLabel:'中等', tags:['链表','哈希'], languages:['javascript'], url:'https://leetcode.cn/problems/copy-list-with-random-pointer/',
  lead:<>为带有 <code>next</code> 与 <code>random</code> 指针的链表构造深拷贝；副本中的指针不能指向原节点。</>,
  note:'先把每个副本插在原节点之后，便可通过 original.random.next 找到对应的副本目标。设置 random 后，再把交错链表拆成两条独立链表。',
  example:<><code>head = [[7,null],[13,0],[11,4],[10,2],[1,0]]</code><strong>→ 独立但结构相同的新链表</strong></>,
  Visualizer:lazy(()=>import('./CopyRandomListVisualizer').then((module)=>({default:module.CopyRandomListVisualizer}))),
} satisfies ProblemDefinition

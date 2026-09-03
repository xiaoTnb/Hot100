import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const slidingWindowMaximumProblem = {
  slug: 'sliding-window-maximum',
  number: '11',
  leetcodeId: 'LeetCode #239',
  title: '滑动窗口最大值',
  difficulty: 'hard',
  difficultyLabel: '困难',
  tags: ['队列', '滑动窗口', '单调队列'],
  url: 'https://leetcode.cn/problems/sliding-window-maximum/',
  lead: <>大小为 <code>k</code> 的窗口从左向右移动，每次返回当前窗口中的最大值。</>,
  note: '单调队列保存下标，对应数值从队首到队尾递减。新元素从右侧进入时淘汰不比它大的队尾；队首过期时删除；因此窗口最大值始终在队首。',
  example: <><code>nums = [1, 3, -1, -3, 5, 3, 6, 7]，k = 3</code><strong>→ [3, 3, 5, 5, 6, 7]</strong></>,
  Visualizer: lazy(() => import('./SlidingWindowMaximumVisualizer').then((module) => ({ default: module.SlidingWindowMaximumVisualizer }))),
} satisfies ProblemDefinition

import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface CycleStep {
  slow: number
  fast: number
  slowTrail: number[]
  fastTrail: number[]
  phase: 'start' | 'chase' | 'meet'
  lineId: string
  message: string
}

export const cycleMethods: PlayerMethod[] = [
  { id: 'floyd', label: 'Floyd 快慢指针', complexity: 'O(N) · O(1)', languages: ['javascript'] },
]

export const cycleCode: CodeLine[] = [
  { id: 'function', text: 'var hasCycle = function (head) {' },
  { id: 'fast-init', text: '  let fast = head' },
  { id: 'slow-init', text: '  let slow = head' },
  { id: 'while', text: '  while (fast && fast.next) {' },
  { id: 'fast-move', text: '    fast = fast.next.next' },
  { id: 'slow-move', text: '    slow = slow.next' },
  { id: 'compare', text: '    if (fast === slow) {' },
  { id: 'true', text: '      return true' },
  { id: 'if-close', text: '    }' },
  { id: 'while-close', text: '  }' },
  { id: 'false', text: '  return false' },
  { id: 'end', text: '};' },
]

export const cycleSteps: CycleStep[] = [
  { slow: 0, fast: 0, slowTrail: [0], fastTrail: [0], phase: 'start', lineId: 'slow-init', message: 'slow 和 fast 都从 head 出发；fast 将以两倍速度前进' },
  { slow: 1, fast: 2, slowTrail: [0, 1], fastTrail: [0, 1, 2], phase: 'chase', lineId: 'fast-move', message: '第 1 轮：slow 到节点 2，fast 越过它到节点 0' },
  { slow: 2, fast: 1, slowTrail: [0, 1, 2], fastTrail: [0, 1, 2, 3, 1], phase: 'chase', lineId: 'compare', message: '第 2 轮：fast 绕过环尾回到节点 2，仍未与 slow 重合' },
  { slow: 3, fast: 3, slowTrail: [0, 1, 2, 3], fastTrail: [0, 1, 2, 3, 1, 2, 3], phase: 'meet', lineId: 'true', message: '第 3 轮：fast 追上 slow；两个引用指向同一节点，返回 true' },
]

import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type QueuePhase = 'ready' | 'inspect' | 'prune' | 'push' | 'expire' | 'record' | 'done'
export interface QueueStep {
  phase: QueuePhase
  index: number
  left: number
  rawLeft: number
  queue: number[]
  removedIndex: number
  answers: (number | null)[]
  lineId: string
  message: string
}

export const windowNumbers = [1, 3, -1, -3, 5, 3, 6, 7]
export const windowSize = 3
export const queueMethods: PlayerMethod[] = [{ id: 'deque', label: '单调队列', complexity: 'O(N) · O(K)' }]
export const queueCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'method', text: '  public int[] maxSlidingWindow(int[] nums, int k) {' },
  { id: 'n', text: '    int n = nums.length;' },
  { id: 'answer', text: '    int[] ans = new int[n - k + 1];' },
  { id: 'queue', text: '    Deque<Integer> q = new ArrayDeque<>();' },
  { id: 'blank-1', text: '' },
  { id: 'loop', text: '    for (int i = 0; i < n; i++) {' },
  { id: 'comment-1', text: '      // 1. 右边入：维护队列对应值单调递减' },
  { id: 'while', text: '      while (!q.isEmpty() && nums[q.getLast()] <= nums[i]) {' },
  { id: 'remove-last', text: '        q.removeLast();' },
  { id: 'while-close', text: '      }' },
  { id: 'add-last', text: '      q.addLast(i);' },
  { id: 'blank-2', text: '' },
  { id: 'comment-2', text: '      // 2. 左边出：删除已经离开窗口的队首' },
  { id: 'left', text: '      int left = i - k + 1;' },
  { id: 'expired', text: '      if (q.getFirst() < left) {' },
  { id: 'remove-first', text: '        q.removeFirst();' },
  { id: 'expired-close', text: '      }' },
  { id: 'blank-3', text: '' },
  { id: 'comment-3', text: '      // 3. 队首就是当前窗口最大值' },
  { id: 'full', text: '      if (left >= 0) {' },
  { id: 'record', text: '        ans[left] = nums[q.getFirst()];' },
  { id: 'full-close', text: '      }' },
  { id: 'loop-close', text: '    }' },
  { id: 'blank-4', text: '' },
  { id: 'return', text: '    return ans;' },
  { id: 'method-close', text: '  }' },
  { id: 'class-close', text: '}' },
]

const base = (values: Partial<QueueStep>): QueueStep => ({ phase: 'ready', index: -1, left: 0, rawLeft: 0, queue: [], removedIndex: -1, answers: Array(windowNumbers.length - windowSize + 1).fill(null), lineId: 'queue', message: '创建一个双端队列 q；里面保存下标，对应数值从队首到队尾单调递减', ...values })

export function makeQueueSteps(): QueueStep[] {
  const queue: number[] = []
  const answers: (number | null)[] = Array(windowNumbers.length - windowSize + 1).fill(null)
  const steps: QueueStep[] = [base({})]
  for (let index = 0; index < windowNumbers.length; index++) {
    const value = windowNumbers[index]
    const left = index - windowSize + 1
    steps.push(base({ phase: 'inspect', index, left: Math.max(0, left), rawLeft: left, queue: [...queue], answers: [...answers], lineId: 'while', message: queue.length === 0 ? `i = ${index}，新数 ${value} 准备从队尾进入；当前队列为空` : `i = ${index}，新数 ${value} 准备入队；先和队尾 nums[${queue.at(-1)}] = ${windowNumbers[queue.at(-1)!]} 比较` }))
    while (queue.length > 0 && windowNumbers[queue[queue.length - 1]] <= value) {
      const removedIndex = queue.pop()!
      steps.push(base({ phase: 'prune', index, left: Math.max(0, left), rawLeft: left, queue: [...queue], removedIndex, answers: [...answers], lineId: 'remove-last', message: `${value} ≥ 队尾 ${windowNumbers[removedIndex]}：新数更大且更晚离开窗口，旧队尾不可能再成为最大值，删除下标 ${removedIndex}` }))
    }
    queue.push(index)
    steps.push(base({ phase: 'push', index, left: Math.max(0, left), rawLeft: left, queue: [...queue], answers: [...answers], lineId: 'add-last', message: `把下标 ${index} 入队；队列下标为 [${queue.join(', ')}]，对应值保持从大到小` }))
    if (queue[0] < left) {
      const removedIndex = queue.shift()!
      steps.push(base({ phase: 'expire', index, left, rawLeft: left, queue: [...queue], removedIndex, answers: [...answers], lineId: 'remove-first', message: `left = i - k + 1 = ${index} - ${windowSize} + 1 = ${left}；队首下标 ${removedIndex} < ${left}，它已离开窗口，从队首删除` }))
    } else {
      steps.push(base({ phase: 'expire', index, left: Math.max(0, left), rawLeft: left, queue: [...queue], removedIndex: -1, answers: [...answers], lineId: 'expired', message: left < 0 ? `left = i - k + 1 = ${index} - ${windowSize} + 1 = ${left}；窗口还没凑满 ${windowSize} 个数字，不删除过期下标` : `left = i - k + 1 = ${index} - ${windowSize} + 1 = ${left}；队首下标 ${queue[0]} 仍在窗口内，不删除` }))
    }
    if (left >= 0) {
      const maxIndex = queue[0]
      answers[left] = windowNumbers[maxIndex]
      steps.push(base({ phase: 'record', index, left, rawLeft: left, queue: [...queue], answers: [...answers], lineId: 'record', message: `窗口 [${left}, ${index}] 已形成；队首下标 ${maxIndex} 对应 ${windowNumbers[maxIndex]}，记录 ans[${left}] = ${windowNumbers[maxIndex]}` }))
    }
  }
  steps.push(base({ phase: 'done', index: windowNumbers.length - 1, left: windowNumbers.length - windowSize, rawLeft: windowNumbers.length - windowSize, queue: [...queue], answers: [...answers], lineId: 'return', message: '全部窗口处理完成，返回 [3, 3, 5, 5, 6, 7]' }))
  return steps
}

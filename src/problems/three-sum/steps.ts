import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ThreePhase = 'sort' | 'first' | 'second' | 'move' | 'advance' | 'skip' | 'found' | 'break' | 'done'
export interface ThreeStep { first: number | null; second: number | null; third: number | null; target: number | null; sum: number | null; phase: ThreePhase; direction?: 'increase' | 'decrease' | 'match'; results: number[][]; lineId: string; message: string }

export const threeOriginal = [-1, 0, 1, 2, -1, -4]
export const threeSorted = [...threeOriginal].sort((a, b) => a - b)
export const threeMethods: PlayerMethod[] = [{ id: 'sort-pointers', label: '排序 + 双指针', complexity: 'O(N²)' }]

export const threeCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'method', text: '  public List<List<Integer>> threeSum(int[] nums) {' },
  { id: 'sort', text: '    Arrays.sort(nums);' },
  { id: 'answer', text: '    List<List<Integer>> result = new ArrayList<List<Integer>>();' },
  { id: 'pointers', text: '    int b = 0, c = 0;' },
  { id: 'first-loop', text: '    for (int a = 0; a < nums.length; a++) {' },
  { id: 'skip-first', text: '      if (a > 0 && nums[a] == nums[a - 1]) {' },
  { id: 'continue-first', text: '        continue;' },
  { id: 'skip-first-close', text: '      }' },
  { id: 'second', text: '      b = a + 1;' },
  { id: 'third', text: '      c = nums.length - 1;' },
  { id: 'target', text: '      int target = -nums[a];' },
  { id: 'second-loop', text: '      for (b = a + 1; b < c; b++) {' },
  { id: 'skip-second', text: '        if (b > a + 1 && nums[b] == nums[b - 1]) {' },
  { id: 'continue-second', text: '          continue;' },
  { id: 'skip-second-close', text: '        }' },
  { id: 'while', text: '        while (b < c && nums[b] + nums[c] > target) {' },
  { id: 'move-third', text: '          c--;' },
  { id: 'while-close', text: '        }' },
  { id: 'meet', text: '        if (b == c) {' },
  { id: 'break', text: '          break;' },
  { id: 'meet-close', text: '        }' },
  { id: 'equal', text: '        if (nums[b] + nums[c] == target) {' },
  { id: 'list', text: '          List<Integer> list = new ArrayList<Integer>();' },
  { id: 'add-a', text: '          list.add(nums[a]);' },
  { id: 'add-b', text: '          list.add(nums[b]);' },
  { id: 'add-c', text: '          list.add(nums[c]);' },
  { id: 'add-answer', text: '          result.add(list);' },
  { id: 'equal-close', text: '        }' },
  { id: 'second-close', text: '      }' },
  { id: 'first-close', text: '    }' },
  { id: 'return', text: '    return result;' },
  { id: 'method-close', text: '  }' },
  { id: 'class-close', text: '}' },
]

const copyResults = (results: number[][]) => results.map((item) => [...item])

export function makeThreeSteps(): ThreeStep[] {
  const results: number[][] = []
  const steps: ThreeStep[] = [{ first: null, second: null, third: null, target: null, sum: null, phase: 'sort', results: [], lineId: 'sort', message: `先排序：${threeOriginal.join(', ')} → ${threeSorted.join(', ')}` }]
  const n = threeSorted.length

  for (let first = 0; first < n; first++) {
    if (first > 0 && threeSorted[first] === threeSorted[first - 1]) {
      steps.push({ first, second: null, third: null, target: -threeSorted[first], sum: null, phase: 'skip', results: copyResults(results), lineId: 'continue-first', message: `a = ${threeSorted[first]} 与上一个 a 重复，整轮跳过，避免产生重复三元组` })
      continue
    }
    let third = n - 1
    const target = -threeSorted[first]
    steps.push({ first, second: null, third, target, sum: null, phase: 'first', results: copyResults(results), lineId: 'target', message: `固定 a = ${threeSorted[first]}，接下来寻找 b + c = ${target}` })

    for (let second = first + 1; second < third; second++) {
      if (second > first + 1 && threeSorted[second] === threeSorted[second - 1]) {
        steps.push({ first, second, third, target, sum: null, phase: 'skip', results: copyResults(results), lineId: 'continue-second', message: `b = ${threeSorted[second]} 与上一个 b 重复，执行 continue；随后 for 仍会执行 b++` })
        continue
      }
      let sum = threeSorted[second] + threeSorted[third]
      steps.push({ first, second, third, target, sum, phase: 'second', direction: sum < target ? 'increase' : sum > target ? 'decrease' : 'match', results: copyResults(results), lineId: 'second-loop', message: sum < target ? `b + c = ${sum} < ${target}：while 的“大于”条件为 false，等于判断也为 false；循环体结束后执行 b++` : sum > target ? `b + c = ${sum} > ${target}，满足 while 条件，需要让 c 左移使和变小` : `b + c = ${sum}，正好等于目标 ${target}` })
      while (second < third && sum > target) {
        const oldThird = third
        third--
        sum = threeSorted[second] + threeSorted[third]
        steps.push({ first, second, third, target, sum, phase: 'move', direction: 'decrease', results: copyResults(results), lineId: 'move-third', message: `和偏大时必须让 c 左移：排序后 c 会变小；若让 b 右移，b 只会更大。c 从下标 ${oldThird} 移到 ${third}，新和为 ${sum}` })
      }
      if (second === third) {
        steps.push({ first, second, third, target, sum, phase: 'break', results: copyResults(results), lineId: 'break', message: 'b 与 c 相遇，已经没有三个不同下标，结束当前 a 的枚举' })
        break
      }
      if (sum === target) {
        const triple = [threeSorted[first], threeSorted[second], threeSorted[third]]
        results.push(triple)
        steps.push({ first, second, third, target, sum, phase: 'found', direction: 'match', results: copyResults(results), lineId: 'add-answer', message: `${triple.join(' + ')} = 0，收集三元组 [${triple.join(', ')}]；下一轮 for 循环继续让 b 右移` })
      }
      const nextSecond = second + 1
      steps.push({
        first, second: nextSecond, third, target,
        sum: nextSecond <= third ? threeSorted[nextSecond] + threeSorted[third] : null,
        phase: 'advance', direction: 'increase', results: copyResults(results), lineId: 'second-loop',
        message: nextSecond < third
          ? `当前循环体结束，执行 for 的 b++：b 从下标 ${second} 右移到 ${nextSecond}`
          : `执行 b++ 后 b = c = ${third}，条件 b < c 不成立，内层循环结束`,
      })
    }
  }
  steps.push({ first: null, second: null, third: null, target: null, sum: null, phase: 'done', results: copyResults(results), lineId: 'return', message: '遍历完成，返回两个互不重复的三元组' })
  return steps
}

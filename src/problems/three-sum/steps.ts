import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ThreePhase = 'sort' | 'first' | 'second' | 'move' | 'skip' | 'found' | 'break' | 'done'
export interface ThreeStep { first: number | null; second: number | null; third: number | null; target: number | null; sum: number | null; phase: ThreePhase; results: number[][]; lineId: string; message: string }

export const threeOriginal = [-1, 0, 1, 2, -1, -4]
export const threeSorted = [...threeOriginal].sort((a, b) => a - b)
export const threeMethods: PlayerMethod[] = [{ id: 'sort-pointers', label: '排序 + 双指针', complexity: 'O(N²)' }]

export const threeCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'method', text: '  public List<List<Integer>> threeSum(int[] nums) {' },
  { id: 'n', text: '    int n = nums.length;' },
  { id: 'sort', text: '    Arrays.sort(nums);' },
  { id: 'answer', text: '    List<List<Integer>> ans = new ArrayList<List<Integer>>();' },
  { id: 'first-loop', text: '    for (int first = 0; first < n; ++first) {' },
  { id: 'skip-first', text: '      if (first > 0 && nums[first] == nums[first - 1]) {' },
  { id: 'continue-first', text: '        continue;' },
  { id: 'skip-first-close', text: '      }' },
  { id: 'third', text: '      int third = n - 1;' },
  { id: 'target', text: '      int target = -nums[first];' },
  { id: 'second-loop', text: '      for (int second = first + 1; second < n; ++second) {' },
  { id: 'skip-second', text: '        if (second > first + 1 && nums[second] == nums[second - 1]) {' },
  { id: 'continue-second', text: '          continue;' },
  { id: 'skip-second-close', text: '        }' },
  { id: 'while', text: '        while (second < third && nums[second] + nums[third] > target) {' },
  { id: 'move-third', text: '          --third;' },
  { id: 'while-close', text: '        }' },
  { id: 'meet', text: '        if (second == third) {' },
  { id: 'break', text: '          break;' },
  { id: 'meet-close', text: '        }' },
  { id: 'equal', text: '        if (nums[second] + nums[third] == target) {' },
  { id: 'list', text: '          List<Integer> list = new ArrayList<Integer>();' },
  { id: 'add-a', text: '          list.add(nums[first]);' },
  { id: 'add-b', text: '          list.add(nums[second]);' },
  { id: 'add-c', text: '          list.add(nums[third]);' },
  { id: 'add-answer', text: '          ans.add(list);' },
  { id: 'equal-close', text: '        }' },
  { id: 'second-close', text: '      }' },
  { id: 'first-close', text: '    }' },
  { id: 'return', text: '    return ans;' },
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

    for (let second = first + 1; second < n; second++) {
      if (second > first + 1 && threeSorted[second] === threeSorted[second - 1]) {
        steps.push({ first, second, third, target, sum: null, phase: 'skip', results: copyResults(results), lineId: 'continue-second', message: `b = ${threeSorted[second]} 与上一个 b 重复，跳过这个位置` })
        continue
      }
      let sum = threeSorted[second] + threeSorted[third]
      steps.push({ first, second, third, target, sum, phase: 'second', results: copyResults(results), lineId: 'second-loop', message: `枚举 b = ${threeSorted[second]}，从右侧 c = ${threeSorted[third]} 开始检查` })
      while (second < third && sum > target) {
        const oldThird = third
        third--
        sum = threeSorted[second] + threeSorted[third]
        steps.push({ first, second, third, target, sum, phase: 'move', results: copyResults(results), lineId: 'move-third', message: `原来的 b + c 太大，c 从下标 ${oldThird} 左移到 ${third}，新的和为 ${sum}` })
      }
      if (second === third) {
        steps.push({ first, second, third, target, sum, phase: 'break', results: copyResults(results), lineId: 'break', message: 'b 与 c 相遇，已经没有三个不同下标，结束当前 a 的枚举' })
        break
      }
      if (sum === target) {
        const triple = [threeSorted[first], threeSorted[second], threeSorted[third]]
        results.push(triple)
        steps.push({ first, second, third, target, sum, phase: 'found', results: copyResults(results), lineId: 'add-answer', message: `${triple.join(' + ')} = 0，收集三元组 [${triple.join(', ')}]` })
      }
    }
  }
  steps.push({ first: null, second: null, third: null, target: null, sum: null, phase: 'done', results: copyResults(results), lineId: 'return', message: '遍历完成，返回两个互不重复的三元组' })
  return steps
}

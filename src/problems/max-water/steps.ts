import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type WaterPhase = 'calculate' | 'update' | 'move' | 'done'
export interface WaterStep { l: number; r: number; area: number; best: number; phase: WaterPhase; moving: 'left' | 'right' | null; lineId: string; message: string }

export const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
export const waterMethods: PlayerMethod[] = [{ id: 'two-pointers', label: '双指针', complexity: 'O(N) · O(1)' }]
export const waterCode: CodeLine[] = [
  { id: 'class', text: 'public class Solution {' },
  { id: 'method', text: '  public int maxArea(int[] height) {' },
  { id: 'init', text: '    int l = 0, r = height.length - 1;' },
  { id: 'answer', text: '    int ans = 0;' },
  { id: 'while', text: '    while (l < r) {' },
  { id: 'area', text: '      int area = Math.min(height[l], height[r]) * (r - l);' },
  { id: 'max', text: '      ans = Math.max(ans, area);' },
  { id: 'if', text: '      if (height[l] <= height[r]) {' },
  { id: 'left', text: '        ++l;' },
  { id: 'if-close', text: '      }' },
  { id: 'else', text: '      else {' },
  { id: 'right', text: '        --r;' },
  { id: 'else-close', text: '      }' },
  { id: 'while-close', text: '    }' },
  { id: 'return', text: '    return ans;' },
  { id: 'method-close', text: '  }' },
  { id: 'class-close', text: '}' },
]

export function makeWaterSteps(): WaterStep[] {
  const steps: WaterStep[] = []
  let l = 0
  let r = heights.length - 1
  let best = 0
  while (l < r) {
    const level = Math.min(heights[l], heights[r])
    const width = r - l
    const area = level * width
    steps.push({ l, r, area, best, phase: 'calculate', moving: null, lineId: 'area', message: `水面由短边决定：min(${heights[l]}, ${heights[r]}) × (${r} - ${l}) = ${level} × ${width} = ${area}` })
    const previous = best
    best = Math.max(best, area)
    steps.push({ l, r, area, best, phase: 'update', moving: null, lineId: 'max', message: best > previous ? `面积 ${area} 超过原纪录 ${previous}，最大水量更新为 ${best}` : `面积 ${area} 没有超过 ${best}，最大水量保持不变` })
    if (heights[l] <= heights[r]) {
      steps.push({ l, r, area, best, phase: 'move', moving: 'left', lineId: 'left', message: `左边 ${heights[l]} ≤ 右边 ${heights[r]}：左边限制水面，淘汰左边并令 l++` })
      l++
    } else {
      steps.push({ l, r, area, best, phase: 'move', moving: 'right', lineId: 'right', message: `右边 ${heights[r]} 更短：右边限制水面，淘汰右边并令 r--` })
      r--
    }
  }
  steps.push({ l, r, area: 0, best, phase: 'done', moving: null, lineId: 'return', message: `双指针相遇，所有可能更优的边界都已检查，返回最大水量 ${best}` })
  return steps
}

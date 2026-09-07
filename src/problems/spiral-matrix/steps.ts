import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type SpiralDirection = 'right' | 'down' | 'left' | 'up' | 'done'
export interface SpiralStep { matrix: number[][]; top: number; bottom: number; left: number; right: number; row: number; col: number; direction: SpiralDirection; answer: number[]; lineId: string; message: string }
export const spiralInput = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
export const spiralMethods: PlayerMethod[] = [{ id: 'boundaries', label: '四边界模拟', complexity: 'O(MN)', languages: ['java'] }]
export const spiralCode: CodeLine[] = [
  { id: 's-class', text: 'class Solution {' },
  { id: 's-method', text: '  public List<Integer> spiralOrder(int[][] matrix) {' },
  { id: 's-ans', text: '    List<Integer> ans = new ArrayList<>();' },
  { id: 's-bounds', text: '    int top = 0, bottom = matrix.length - 1;' },
  { id: 's-bounds-2', text: '    int left = 0, right = matrix[0].length - 1;' },
  { id: 's-while', text: '    while (top <= bottom && left <= right) {' },
  { id: 's-right-loop', text: '      for (int j = left; j <= right; j++)' },
  { id: 's-right-add', text: '        ans.add(matrix[top][j]);' },
  { id: 's-top', text: '      top++;' },
  { id: 's-down-loop', text: '      for (int i = top; i <= bottom; i++)' },
  { id: 's-down-add', text: '        ans.add(matrix[i][right]);' },
  { id: 's-right', text: '      right--;' },
  { id: 's-check', text: '      if (top <= bottom) {' },
  { id: 's-left-loop', text: '        for (int j = right; j >= left; j--)' },
  { id: 's-left-add', text: '          ans.add(matrix[bottom][j]);' },
  { id: 's-bottom', text: '        bottom--;' },
  { id: 's-check-close', text: '      }' },
  { id: 's-check-2', text: '      if (left <= right) {' },
  { id: 's-up-loop', text: '        for (int i = bottom; i >= top; i--)' },
  { id: 's-up-add', text: '          ans.add(matrix[i][left]);' },
  { id: 's-left', text: '        left++;' },
  { id: 's-check-2-close', text: '      }' },
  { id: 's-while-close', text: '    }' },
  { id: 's-return', text: '    return ans;' },
  { id: 's-method-close', text: '  }' },
  { id: 's-class-close', text: '}' },
]

export function makeSpiralSteps(): SpiralStep[] {
  let top = 0, bottom = spiralInput.length - 1, left = 0, right = spiralInput[0].length - 1
  const answer: number[] = [], steps: SpiralStep[] = []
  const add = (row: number, col: number, direction: SpiralDirection, lineId: string) => { answer.push(spiralInput[row][col]); steps.push({ matrix: spiralInput, top, bottom, left, right, row, col, direction, answer: [...answer], lineId, message: '访问 matrix[' + row + '][' + col + '] = ' + spiralInput[row][col] + '，加入 ans' }) }
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) add(top, j, 'right', 's-right-add')
    top++; steps.push({ matrix: spiralInput, top, bottom, left, right, row: -1, col: -1, direction: 'right', answer: [...answer], lineId: 's-top', message: '上边界已经走完，top++ → ' + top })
    for (let i = top; i <= bottom; i++) add(i, right, 'down', 's-down-add')
    right--; steps.push({ matrix: spiralInput, top, bottom, left, right, row: -1, col: -1, direction: 'down', answer: [...answer], lineId: 's-right', message: '右边界已经走完，right-- → ' + right })
    if (top <= bottom) { for (let j = right; j >= left; j--) add(bottom, j, 'left', 's-left-add'); bottom--; steps.push({ matrix: spiralInput, top, bottom, left, right, row: -1, col: -1, direction: 'left', answer: [...answer], lineId: 's-bottom', message: '下边界已经走完，bottom-- → ' + bottom }) }
    if (left <= right) { for (let i = bottom; i >= top; i--) add(i, left, 'up', 's-up-add'); left++; steps.push({ matrix: spiralInput, top, bottom, left, right, row: -1, col: -1, direction: 'up', answer: [...answer], lineId: 's-left', message: '左边界已经走完，left++ → ' + left }) }
  }
  steps.push({ matrix: spiralInput, top, bottom, left, right, row: -1, col: -1, direction: 'done', answer, lineId: 's-return', message: '四条边界相遇，所有元素恰好访问一次' })
  return steps
}

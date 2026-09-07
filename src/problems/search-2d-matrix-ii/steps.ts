import type { CodeLine, PlayerMethod } from '../../components/player/types'
export type SearchPhase = 'compare' | 'row' | 'col' | 'found' | 'miss'
export interface SearchStep { row: number; col: number; eliminatedRows: number[]; eliminatedCols: number[]; phase: SearchPhase; value: number | null; lineId: string; message: string }
export const searchMatrixInput = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]]
export const searchMatrixTarget = 20
export const searchMatrixIIMethods: PlayerMethod[] = [{ id: 'elimination', label: '右上角排除法', complexity: 'O(M + N) · O(1)', languages: ['java'] }]
export const searchMatrixIICode: CodeLine[] = [
  { id: 'q-class', text: 'class Solution {' }, { id: 'q-method', text: '  public boolean searchMatrix(int[][] matrix, int target) {' }, { id: 'q-i', text: '    int i = 0;' }, { id: 'q-j', text: '    int j = matrix[0].length - 1;' }, { id: 'q-while', text: '    while (i < matrix.length && j >= 0) {' }, { id: 'q-equal', text: '      if (matrix[i][j] == target) {' }, { id: 'q-true', text: '        return true;' }, { id: 'q-equal-close', text: '      }' }, { id: 'q-less', text: '      if (matrix[i][j] < target) {' }, { id: 'q-down', text: '        i++;' }, { id: 'q-else', text: '      } else {' }, { id: 'q-left', text: '        j--;' }, { id: 'q-close', text: '      }' }, { id: 'q-while-close', text: '    }' }, { id: 'q-false', text: '    return false;' }, { id: 'q-method-close', text: '  }' }, { id: 'q-class-close', text: '}' },
]
export function makeSearchMatrixIISteps(): SearchStep[] {
  let i = 0, j = searchMatrixInput[0].length - 1
  const rows: number[] = [], cols: number[] = [], steps: SearchStep[] = []
  while (i < searchMatrixInput.length && j >= 0) {
    const value = searchMatrixInput[i][j]
    steps.push({ row: i, col: j, eliminatedRows: [...rows], eliminatedCols: [...cols], phase: 'compare', value, lineId: 'q-equal', message: '比较右上角 matrix[' + i + '][' + j + '] = ' + value + ' 与 target = ' + searchMatrixTarget })
    if (value === searchMatrixTarget) { steps.push({ row: i, col: j, eliminatedRows: rows, eliminatedCols: cols, phase: 'found', value, lineId: 'q-true', message: '值相等，返回 true' }); return steps }
    if (value < searchMatrixTarget) { rows.push(i); steps.push({ row: i, col: j, eliminatedRows: [...rows], eliminatedCols: [...cols], phase: 'row', value, lineId: 'q-down', message: value + ' < ' + searchMatrixTarget + '：这一行当前值左侧更小，整行都不可能，排除第 ' + i + ' 行并 i++' }); i++ }
    else { cols.push(j); steps.push({ row: i, col: j, eliminatedRows: [...rows], eliminatedCols: [...cols], phase: 'col', value, lineId: 'q-left', message: value + ' > ' + searchMatrixTarget + '：这一列当前值下方更大，整列都不可能，排除第 ' + j + ' 列并 j--' }); j-- }
  }
  steps.push({ row: i, col: j, eliminatedRows: rows, eliminatedCols: cols, phase: 'miss', value: null, lineId: 'q-false', message: '指针越过矩阵边界，剩余区域为空，返回 false' })
  return steps
}

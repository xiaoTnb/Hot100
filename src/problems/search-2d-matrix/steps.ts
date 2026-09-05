import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type MatrixPhase = 'ready' | 'probe' | 'move-left' | 'move-right' | 'found' | 'done'
export interface MatrixStep { left: number; right: number; mid: number; row: number; column: number; value: number | null; phase: MatrixPhase; lineId: string; message: string }

export const searchMatrixInput = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
export const searchMatrixTarget = 3
export const searchMatrixMethods: PlayerMethod[] = [{ id: 'flattened', label: '一维映射二分', complexity: 'O(log MN) · O(1)', languages: ['javascript'] }]
export const searchMatrixCode: CodeLine[] = [
  { id: 'method', text: 'function searchMatrix(matrix, target) {' },
  { id: 'columns', text: '    const m = matrix[0].length' },
  { id: 'rows', text: '    const n = matrix.length' },
  { id: 'left', text: '    let left = -1' },
  { id: 'right', text: '    let right = m * n' },
  { id: 'loop', text: '    while (left + 1 < right) {' },
  { id: 'mid', text: '        const mid = Math.floor((left + right) / 2)' },
  { id: 'map', text: '        const x = matrix[Math.floor(mid / m)][mid % m]' },
  { id: 'equal', text: '        if (x === target) {' },
  { id: 'return-true', text: '            return true' },
  { id: 'equal-close', text: '        }' },
  { id: 'greater', text: '        if (x > target) {' },
  { id: 'move-right', text: '            right = mid' },
  { id: 'else', text: '        } else {' },
  { id: 'move-left', text: '            left = mid' },
  { id: 'if-close', text: '        }' },
  { id: 'loop-close', text: '    }' },
  { id: 'return-false', text: '    return false' },
  { id: 'close', text: '}' },
]

export function makeSearchMatrixSteps(): MatrixStep[] {
  const columns = searchMatrixInput[0].length
  const flat = searchMatrixInput.flat()
  let left = -1
  let right = flat.length
  const base = (values: Partial<MatrixStep>): MatrixStep => ({ left, right, mid: -1, row: -1, column: -1, value: null, phase: 'ready', lineId: '', message: '', ...values })
  const steps = [base({ lineId: 'right', message: `矩阵有 3 × ${columns} = ${flat.length} 个元素，把线性下标范围初始化为 (−1, ${flat.length})` })]
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2)
    const row = Math.floor(mid / columns)
    const column = mid % columns
    const value = searchMatrixInput[row][column]
    steps.push(base({ mid, row, column, value, phase: 'probe', lineId: 'map', message: `mid = ${mid} 映射到 [${row}][${column}]，读到 ${value}` }))
    if (value === searchMatrixTarget) {
      steps.push(base({ mid, row, column, value, phase: 'found', lineId: 'return-true', message: `${value} === target，在矩阵坐标 [${row}, ${column}] 找到目标，返回 true` }))
      return steps
    }
    if (value > searchMatrixTarget) {
      right = mid
      steps.push(base({ mid, row, column, value, phase: 'move-right', lineId: 'move-right', message: `${value} > ${searchMatrixTarget}，答案只可能在更小的一侧，令 right = ${mid}` }))
    } else {
      left = mid
      steps.push(base({ mid, row, column, value, phase: 'move-left', lineId: 'move-left', message: `${value} < ${searchMatrixTarget}，答案只可能在更大的一侧，令 left = ${mid}` }))
    }
  }
  steps.push(base({ phase: 'done', lineId: 'return-false', message: '候选区间为空，没有找到 target，返回 false' }))
  return steps
}

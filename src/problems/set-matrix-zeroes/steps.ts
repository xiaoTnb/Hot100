import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ZeroMethod = 'arrays' | 'inplace'
export type ZeroPhase = 'scan' | 'mark' | 'apply' | 'first-col' | 'first-row' | 'done'
export interface ZeroStep { phase: ZeroPhase; matrix: number[][]; rowMarks: boolean[]; colMarks: boolean[]; row: number; col: number; firstRow: boolean; firstCol: boolean; lineId: string; message: string }

export const zeroInput = [[0, 1, 2, 0], [3, 4, 0, 2], [1, 3, 1, 5]]
export const zeroMethods: PlayerMethod[] = [
  { id: 'inplace', label: '复用首行首列', complexity: 'O(MN) · O(1)', languages: ['java'] },
  { id: 'arrays', label: '行列标记数组', complexity: 'O(MN) · O(M+N)', languages: ['java'] },
]

const arraysCode: CodeLine[] = [
  { id: 'a-class', text: 'class Solution {' },
  { id: 'a-method', text: '  public void setZeroes(int[][] matrix) {' },
  { id: 'a-size', text: '    int m = matrix.length, n = matrix[0].length;' },
  { id: 'a-row', text: '    boolean[] rowHasZero = new boolean[m];' },
  { id: 'a-col', text: '    boolean[] colHasZero = new boolean[n];' },
  { id: 'a-scan-i', text: '    for (int i = 0; i < m; i++) {' },
  { id: 'a-scan-j', text: '      for (int j = 0; j < n; j++) {' },
  { id: 'a-if-zero', text: '        if (matrix[i][j] == 0) {' },
  { id: 'a-mark', text: '          rowHasZero[i] = colHasZero[j] = true;' },
  { id: 'a-if-close', text: '        }' },
  { id: 'a-j-close', text: '      }' },
  { id: 'a-i-close', text: '    }' },
  { id: 'a-apply-i', text: '    for (int i = 0; i < m; i++) {' },
  { id: 'a-apply-j', text: '      for (int j = 0; j < n; j++) {' },
  { id: 'a-apply-if', text: '        if (rowHasZero[i] || colHasZero[j]) {' },
  { id: 'a-write', text: '          matrix[i][j] = 0;' },
  { id: 'a-apply-close', text: '        }' },
  { id: 'a-apply-j-close', text: '      }' },
  { id: 'a-apply-i-close', text: '    }' },
  { id: 'a-method-close', text: '  }' },
  { id: 'a-class-close', text: '}' },
]

const inplaceCode: CodeLine[] = [
  { id: 'i-class', text: 'class Solution {' },
  { id: 'i-method', text: '  public void setZeroes(int[][] matrix) {' },
  { id: 'i-size', text: '    int m = matrix.length, n = matrix[0].length;' },
  { id: 'i-first-row', text: '    boolean firstRowHasZero = false;' },
  { id: 'i-row-scan', text: '    for (int x : matrix[0]) {' },
  { id: 'i-row-if', text: '      if (x == 0) { firstRowHasZero = true; break; }' },
  { id: 'i-row-close', text: '    }' },
  { id: 'i-first-col', text: '    boolean firstColHasZero = false;' },
  { id: 'i-col-scan', text: '    for (int i = 0; i < m; i++) {' },
  { id: 'i-col-if', text: '      if (matrix[i][0] == 0) { firstColHasZero = true; break; }' },
  { id: 'i-col-close', text: '    }' },
  { id: 'i-mark-i', text: '    for (int i = 1; i < m; i++) {' },
  { id: 'i-mark-j', text: '      for (int j = 1; j < n; j++) {' },
  { id: 'i-mark-if', text: '        if (matrix[i][j] == 0) {' },
  { id: 'i-mark-row', text: '          matrix[i][0] = 0;' },
  { id: 'i-mark-col', text: '          matrix[0][j] = 0;' },
  { id: 'i-mark-close', text: '        }' },
  { id: 'i-mark-j-close', text: '      }' },
  { id: 'i-mark-i-close', text: '    }' },
  { id: 'i-apply-i', text: '    for (int i = 1; i < m; i++) {' },
  { id: 'i-apply-j', text: '      for (int j = 1; j < n; j++) {' },
  { id: 'i-apply-if', text: '        if (matrix[i][0] == 0 || matrix[0][j] == 0)' },
  { id: 'i-write', text: '          matrix[i][j] = 0;' },
  { id: 'i-apply-j-close', text: '      }' },
  { id: 'i-apply-i-close', text: '    }' },
  { id: 'i-final-col', text: '    if (firstColHasZero)' },
  { id: 'i-final-col-loop', text: '      for (int[] row : matrix) row[0] = 0;' },
  { id: 'i-final-row', text: '    if (firstRowHasZero) Arrays.fill(matrix[0], 0);' },
  { id: 'i-method-close', text: '  }' },
  { id: 'i-class-close', text: '}' },
]

export const getZeroCode = (method: ZeroMethod) => method === 'arrays' ? arraysCode : inplaceCode
const copy = (m: number[][]) => m.map((row) => [...row])
const make = (values: Partial<ZeroStep>): ZeroStep => ({ phase: 'scan', matrix: copy(zeroInput), rowMarks: Array(zeroInput.length).fill(false), colMarks: Array(zeroInput[0].length).fill(false), row: -1, col: -1, firstRow: false, firstCol: false, lineId: '', message: '', ...values })

function arraysSteps() {
  const matrix = copy(zeroInput), rowMarks = Array(matrix.length).fill(false) as boolean[], colMarks = Array(matrix[0].length).fill(false) as boolean[], steps: ZeroStep[] = []
  for (let i = 0; i < matrix.length; i++) for (let j = 0; j < matrix[0].length; j++) {
    if (matrix[i][j] === 0) { rowMarks[i] = true; colMarks[j] = true; steps.push(make({ phase: 'mark', matrix: copy(matrix), rowMarks: [...rowMarks], colMarks: [...colMarks], row: i, col: j, lineId: 'a-mark', message: '发现 matrix[' + i + '][' + j + '] = 0：标记第 ' + i + ' 行和第 ' + j + ' 列' })) }
  }
  for (let i = 0; i < matrix.length; i++) for (let j = 0; j < matrix[0].length; j++) if (rowMarks[i] || colMarks[j]) {
    matrix[i][j] = 0
    steps.push(make({ phase: 'apply', matrix: copy(matrix), rowMarks: [...rowMarks], colMarks: [...colMarks], row: i, col: j, lineId: 'a-write', message: 'rowHasZero[' + i + '] 或 colHasZero[' + j + '] 为 true，写入 0' }))
  }
  steps.push(make({ phase: 'done', matrix: copy(matrix), rowMarks, colMarks, lineId: 'a-method-close', message: '所有被标记的行和列已经置零' }))
  return steps
}

function inplaceSteps() {
  const matrix = copy(zeroInput), m = matrix.length, n = matrix[0].length, steps: ZeroStep[] = []
  const firstRow = matrix[0].some((x) => x === 0), firstCol = matrix.some((row) => row[0] === 0)
  steps.push(make({ matrix: copy(matrix), firstRow, firstCol, lineId: 'i-col-if', message: '先保存原始状态：第一行含 0 = ' + firstRow + '，第一列含 0 = ' + firstCol }))
  for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) if (matrix[i][j] === 0) {
    matrix[i][0] = 0; matrix[0][j] = 0
    steps.push(make({ phase: 'mark', matrix: copy(matrix), row: i, col: j, firstRow, firstCol, lineId: 'i-mark-col', message: '内部 0 在 [' + i + ', ' + j + ']：把 matrix[' + i + '][0] 和 matrix[0][' + j + '] 当作标记' }))
  }
  for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) if (matrix[i][0] === 0 || matrix[0][j] === 0) {
    matrix[i][j] = 0
    steps.push(make({ phase: 'apply', matrix: copy(matrix), row: i, col: j, firstRow, firstCol, lineId: 'i-write', message: '查看首列与首行标记，matrix[' + i + '][' + j + '] 应置为 0' }))
  }
  if (firstCol) { for (const row of matrix) row[0] = 0; steps.push(make({ phase: 'first-col', matrix: copy(matrix), firstRow, firstCol, col: 0, lineId: 'i-final-col-loop', message: '第一列原本含 0，现在把第一列整体置零' })) }
  if (firstRow) { matrix[0].fill(0); steps.push(make({ phase: 'first-row', matrix: copy(matrix), firstRow, firstCol, row: 0, lineId: 'i-final-row', message: '第一行原本含 0，最后把第一行整体置零' })) }
  steps.push(make({ phase: 'done', matrix: copy(matrix), firstRow, firstCol, lineId: 'i-method-close', message: '只借用了两个布尔变量，完成原地置零' }))
  return steps
}

export const makeZeroSteps = (method: ZeroMethod) => method === 'arrays' ? arraysSteps() : inplaceSteps()

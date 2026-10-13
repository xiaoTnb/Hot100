import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ZeroMethod = 'arrays' | 'inplace'
export type ZeroPhase = 'init' | 'edge-scan' | 'scan' | 'mark' | 'apply' | 'first-col' | 'first-row' | 'done'
export interface ZeroStep { phase: ZeroPhase; matrix: number[][]; rowMarks: boolean[]; colMarks: boolean[]; row: number; col: number; firstRow: boolean; firstCol: boolean; lineId: string; message: string }

export const zeroInput = [[1, 1, 2, 0], [3, 4, 0, 2], [1, 3, 1, 5]]
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
const make = (values: Partial<ZeroStep>): ZeroStep => ({ phase: 'init', matrix: copy(zeroInput), rowMarks: Array(zeroInput.length).fill(false), colMarks: Array(zeroInput[0].length).fill(false), row: -1, col: -1, firstRow: false, firstCol: false, lineId: '', message: '', ...values })

function arraysSteps() {
  const matrix = copy(zeroInput), rowMarks = Array(matrix.length).fill(false) as boolean[], colMarks = Array(matrix[0].length).fill(false) as boolean[], steps: ZeroStep[] = []
  steps.push(make({ phase: 'init', matrix: copy(matrix), rowMarks: [...rowMarks], colMarks: [...colMarks], lineId: 'a-col', message: '创建 rowHasZero[3] 和 colHasZero[4]，每一格默认都是 false' }))
  for (let i = 0; i < matrix.length; i++) for (let j = 0; j < matrix[0].length; j++) {
    steps.push(make({ phase: 'scan', matrix: copy(matrix), rowMarks: [...rowMarks], colMarks: [...colMarks], row: i, col: j, lineId: 'a-if-zero', message: '按行扫描 matrix[' + i + '][' + j + '] = ' + matrix[i][j] + (matrix[i][j] === 0 ? '，发现原始 0' : '，不是 0，标记数组保持不变') }))
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
  let firstRow = false, firstCol = false
  steps.push(make({ phase: 'init', matrix: copy(matrix), firstRow, firstCol, lineId: 'i-first-row', message: '先创建两个布尔变量，初始都是 false；它们专门保存第一行、第一列原本是否含 0' }))
  for (let j = 0; j < n; j++) {
    steps.push(make({ phase: 'edge-scan', matrix: copy(matrix), row: 0, col: j, firstRow, firstCol, lineId: 'i-row-if', message: '扫描第一行：matrix[0][' + j + '] = ' + matrix[0][j] }))
    if (matrix[0][j] === 0) { firstRow = true; steps.push(make({ phase: 'edge-scan', matrix: copy(matrix), row: 0, col: j, firstRow, firstCol, lineId: 'i-row-if', message: '第一行发现原始 0，保存 firstRowHasZero = true，然后结束第一行扫描' })); break }
  }
  for (let i = 0; i < m; i++) {
    steps.push(make({ phase: 'edge-scan', matrix: copy(matrix), row: i, col: 0, firstRow, firstCol, lineId: 'i-col-if', message: '扫描第一列：matrix[' + i + '][0] = ' + matrix[i][0] }))
    if (matrix[i][0] === 0) { firstCol = true; steps.push(make({ phase: 'edge-scan', matrix: copy(matrix), row: i, col: 0, firstRow, firstCol, lineId: 'i-col-if', message: '第一列发现原始 0，保存 firstColHasZero = true，然后结束第一列扫描' })); break }
  }
  for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) {
    steps.push(make({ phase: 'scan', matrix: copy(matrix), row: i, col: j, firstRow, firstCol, lineId: 'i-mark-if', message: '按行扫描内部格 matrix[' + i + '][' + j + '] = ' + matrix[i][j] + (matrix[i][j] === 0 ? '，需要记录它的行和列' : '，不是 0，继续向右') }))
    if (matrix[i][j] === 0) {
      matrix[i][0] = 0; matrix[0][j] = 0
      steps.push(make({ phase: 'mark', matrix: copy(matrix), row: i, col: j, firstRow, firstCol, lineId: 'i-mark-col', message: '原始 0 位于 [' + i + ', ' + j + ']：matrix[' + i + '][0] = 0 标记第 ' + i + ' 行，matrix[0][' + j + '] = 0 标记第 ' + j + ' 列' }))
    }
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

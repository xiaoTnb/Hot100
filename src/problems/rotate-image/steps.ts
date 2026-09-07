import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ImageMethod = 'two-pass' | 'combined'
export type ImagePhase = 'transpose' | 'reverse' | 'done'
export interface ImageStep { matrix: number[][]; phase: ImagePhase; a: [number, number] | null; b: [number, number] | null; row: number; lineId: string; message: string }
export const imageInput = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
export const imageMethods: PlayerMethod[] = [
  { id: 'two-pass', label: '先转置再翻转', complexity: 'O(N²) · O(1)', languages: ['java'] },
  { id: 'combined', label: '逐行合并循环', complexity: 'O(N²) · O(1)', languages: ['java'] },
]
const twoPassCode: CodeLine[] = [
  { id: 't-class', text: 'class Solution {' }, { id: 't-method', text: '  public void rotate(int[][] matrix) {' }, { id: 't-n', text: '    int n = matrix.length;' },
  { id: 't-i', text: '    for (int i = 0; i < n; i++) {' }, { id: 't-j', text: '      for (int j = 0; j < i; j++) {' }, { id: 't-tmp', text: '        int tmp = matrix[i][j];' }, { id: 't-a', text: '        matrix[i][j] = matrix[j][i];' }, { id: 't-b', text: '        matrix[j][i] = tmp;' }, { id: 't-j-close', text: '      }' }, { id: 't-i-close', text: '    }' },
  { id: 't-row', text: '    for (int[] row : matrix) {' }, { id: 't-rj', text: '      for (int j = 0; j < n / 2; j++) {' }, { id: 't-rtmp', text: '        int tmp = row[j];' }, { id: 't-ra', text: '        row[j] = row[n - 1 - j];' }, { id: 't-rb', text: '        row[n - 1 - j] = tmp;' }, { id: 't-rj-close', text: '      }' }, { id: 't-row-close', text: '    }' }, { id: 't-method-close', text: '  }' }, { id: 't-class-close', text: '}' },
]
const combinedCode: CodeLine[] = [
  { id: 'c-class', text: 'class Solution {' }, { id: 'c-method', text: '  public void rotate(int[][] matrix) {' }, { id: 'c-n', text: '    int n = matrix.length;' }, { id: 'c-i', text: '    for (int i = 0; i < n; i++) {' }, { id: 'c-row', text: '      int[] row = matrix[i];' },
  { id: 'c-j', text: '      for (int j = i + 1; j < n; j++) {' }, { id: 'c-tmp', text: '        int tmp = row[j];' }, { id: 'c-a', text: '        row[j] = matrix[j][i];' }, { id: 'c-b', text: '        matrix[j][i] = tmp;' }, { id: 'c-j-close', text: '      }' },
  { id: 'c-rj', text: '      for (int j = 0; j < n / 2; j++) {' }, { id: 'c-rtmp', text: '        int tmp = row[j];' }, { id: 'c-ra', text: '        row[j] = row[n - 1 - j];' }, { id: 'c-rb', text: '        row[n - 1 - j] = tmp;' }, { id: 'c-rj-close', text: '      }' }, { id: 'c-i-close', text: '    }' }, { id: 'c-method-close', text: '  }' }, { id: 'c-class-close', text: '}' },
]
export const getImageCode = (method: ImageMethod) => method === 'two-pass' ? twoPassCode : combinedCode
const copy = (m: number[][]) => m.map((row) => [...row])
const swap = (m: number[][], a: [number, number], b: [number, number]) => { const tmp = m[a[0]][a[1]]; m[a[0]][a[1]] = m[b[0]][b[1]]; m[b[0]][b[1]] = tmp }
export function makeImageSteps(method: ImageMethod): ImageStep[] {
  const matrix = copy(imageInput), n = matrix.length, steps: ImageStep[] = []
  const pushSwap = (phase: ImagePhase, a: [number, number], b: [number, number], lineId: string, prefix: string, row: number) => { const x = matrix[a[0]][a[1]], y = matrix[b[0]][b[1]]; swap(matrix, a, b); steps.push({ matrix: copy(matrix), phase, a, b, row, lineId, message: prefix + '：交换 ' + x + ' [' + a.join(',') + '] 与 ' + y + ' [' + b.join(',') + ']' }) }
  if (method === 'two-pass') {
    for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) pushSwap('transpose', [i, j], [j, i], 't-b', '沿主对角线转置', i)
    for (let i = 0; i < n; i++) for (let j = 0; j < n / 2; j++) pushSwap('reverse', [i, j], [i, n - 1 - j], 't-rb', '翻转第 ' + i + ' 行', i)
  } else {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) pushSwap('transpose', [i, j], [j, i], 'c-b', '第 ' + i + ' 行参与转置', i)
      for (let j = 0; j < n / 2; j++) pushSwap('reverse', [i, j], [i, n - 1 - j], 'c-rb', '随即翻转第 ' + i + ' 行', i)
    }
  }
  steps.push({ matrix: copy(matrix), phase: 'done', a: null, b: null, row: n - 1, lineId: method === 'two-pass' ? 't-method-close' : 'c-method-close', message: '转置 (i,j) → (j,i)，再行翻转 (j,i) → (j,n−1−i)，得到顺时针 90°' })
  return steps
}

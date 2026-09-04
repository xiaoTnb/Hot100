import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type WindowMethod = 'counts' | 'diff'
export type WindowPhase = 'target' | 'add' | 'covered' | 'update' | 'remove' | 'move' | 'done'
export interface WindowStep {
  phase: WindowPhase
  left: number
  right: number
  cntS: number[]
  cntT: number[]
  diff: number[]
  kinds: number
  geCnt: number
  ansLeft: number
  ansRight: number
  activePosition: number
  activeCode: number
  lineId: string
  message: string
}

export const windowSource = 'ADOBECODEBANC'
export const windowTarget = 'ABC'
export const windowMethods: PlayerMethod[] = [
  { id: 'counts', label: '双计数数组', complexity: 'O(52M + N)' },
  { id: 'diff', label: 'diff + geCnt', complexity: 'O(M + N)' },
]

const countsCode: CodeLine[] = [
  { id: 'c-class', text: 'class Solution {' },
  { id: 'c-method', text: '  public String minWindow(String S, String t) {' },
  { id: 'c-s-count', text: '    int[] cntS = new int[128];' },
  { id: 'c-t-count', text: '    int[] cntT = new int[128];' },
  { id: 'c-t-loop', text: '    for (char c : t.toCharArray()) {' },
  { id: 'c-t-add', text: '      cntT[c]++;' },
  { id: 'c-t-close', text: '    }' },
  { id: 'c-blank-1', text: '' },
  { id: 'c-chars', text: '    char[] s = S.toCharArray();' },
  { id: 'c-m', text: '    int m = s.length;' },
  { id: 'c-ans-left', text: '    int ansLeft = -1;' },
  { id: 'c-ans-right', text: '    int ansRight = m;' },
  { id: 'c-left', text: '    int left = 0;' },
  { id: 'c-blank-2', text: '' },
  { id: 'c-loop', text: '    for (int right = 0; right < m; right++) {' },
  { id: 'c-add', text: '      cntS[s[right]]++;' },
  { id: 'c-while', text: '      while (isCovered(cntS, cntT)) {' },
  { id: 'c-shorter', text: '        if (right - left < ansRight - ansLeft) {' },
  { id: 'c-save-left', text: '          ansLeft = left;' },
  { id: 'c-save-right', text: '          ansRight = right;' },
  { id: 'c-shorter-close', text: '        }' },
  { id: 'c-remove', text: '        cntS[s[left]]--;' },
  { id: 'c-move', text: '        left++;' },
  { id: 'c-while-close', text: '      }' },
  { id: 'c-loop-close', text: '    }' },
  { id: 'c-blank-3', text: '' },
  { id: 'c-return', text: '    return ansLeft < 0 ? "" : S.substring(ansLeft, ansRight + 1);' },
  { id: 'c-method-close', text: '  }' },
  { id: 'c-covered', text: '  private boolean isCovered(int[] cntS, int[] cntT) {' },
  { id: 'c-upper-loop', text: "    for (int i = 'A'; i <= 'Z'; i++) {" },
  { id: 'c-upper-if', text: '      if (cntS[i] < cntT[i]) return false;' },
  { id: 'c-upper-close', text: '    }' },
  { id: 'c-lower-loop', text: "    for (int i = 'a'; i <= 'z'; i++) {" },
  { id: 'c-lower-if', text: '      if (cntS[i] < cntT[i]) return false;' },
  { id: 'c-lower-close', text: '    }' },
  { id: 'c-true', text: '    return true;' },
  { id: 'c-covered-close', text: '  }' },
  { id: 'c-class-close', text: '}' },
]

const diffCode: CodeLine[] = [
  { id: 'd-class', text: 'class Solution {' },
  { id: 'd-method', text: '  public String minWindow(String S, String t) {' },
  { id: 'd-array', text: '    int[] diff = new int[128];' },
  { id: 'd-kinds', text: '    int kinds = 0;' },
  { id: 'd-t-loop', text: '    for (char c : t.toCharArray()) {' },
  { id: 'd-new-kind', text: '      if (diff[c] == 0) {' },
  { id: 'd-kinds-add', text: '        kinds++;' },
  { id: 'd-new-kind-close', text: '      }' },
  { id: 'd-target', text: '      diff[c]--;' },
  { id: 'd-t-close', text: '    }' },
  { id: 'd-blank-1', text: '' },
  { id: 'd-chars', text: '    char[] s = S.toCharArray();' },
  { id: 'd-m', text: '    int m = s.length;' },
  { id: 'd-ans-left', text: '    int ansLeft = -1;' },
  { id: 'd-ans-right', text: '    int ansRight = m;' },
  { id: 'd-ge', text: '    int geCnt = 0;' },
  { id: 'd-left', text: '    int left = 0;' },
  { id: 'd-blank-2', text: '' },
  { id: 'd-loop', text: '    for (int right = 0; right < m; right++) {' },
  { id: 'd-char', text: '      char c = s[right];' },
  { id: 'd-add', text: '      diff[c]++;' },
  { id: 'd-reach', text: '      if (diff[c] == 0) {' },
  { id: 'd-ge-add', text: '        geCnt++;' },
  { id: 'd-reach-close', text: '      }' },
  { id: 'd-blank-3', text: '' },
  { id: 'd-while', text: '      while (geCnt == kinds) {' },
  { id: 'd-shorter', text: '        if (right - left < ansRight - ansLeft) {' },
  { id: 'd-save-left', text: '          ansLeft = left;' },
  { id: 'd-save-right', text: '          ansRight = right;' },
  { id: 'd-shorter-close', text: '        }' },
  { id: 'd-blank-4', text: '' },
  { id: 'd-x', text: '        char x = s[left];' },
  { id: 'd-break', text: '        if (diff[x] == 0) {' },
  { id: 'd-ge-remove', text: '          geCnt--;' },
  { id: 'd-break-close', text: '        }' },
  { id: 'd-remove', text: '        diff[x]--;' },
  { id: 'd-move', text: '        left++;' },
  { id: 'd-while-close', text: '      }' },
  { id: 'd-loop-close', text: '    }' },
  { id: 'd-blank-5', text: '' },
  { id: 'd-return', text: '    return ansLeft < 0 ? "" : S.substring(ansLeft, ansRight + 1);' },
  { id: 'd-method-close', text: '  }' },
  { id: 'd-class-close', text: '}' },
]

export const getWindowCode = (method: WindowMethod) => method === 'counts' ? countsCode : diffCode
const blank = () => Array<number>(128).fill(0)
const covered = (cntS: number[], cntT: number[]) => [...windowTarget].every((char) => cntS[char.charCodeAt(0)] >= cntT[char.charCodeAt(0)])
const base = (values: Partial<WindowStep>): WindowStep => ({ phase: 'target', left: 0, right: -1, cntS: blank(), cntT: blank(), diff: blank(), kinds: 0, geCnt: 0, ansLeft: -1, ansRight: windowSource.length, activePosition: -1, activeCode: -1, lineId: '', message: '', ...values })

function makeCountsSteps(): WindowStep[] {
  const cntS = blank()
  const cntT = blank()
  const steps: WindowStep[] = []
  for (const char of windowTarget) {
    const code = char.charCodeAt(0)
    cntT[code]++
    steps.push(base({ cntS: [...cntS], cntT: [...cntT], activeCode: code, lineId: 'c-t-add', message: '统计目标 t：cntT[\'' + char + '\'] = ' + cntT[code] }))
  }
  let left = 0
  let ansLeft = -1
  let ansRight = windowSource.length
  for (let right = 0; right < windowSource.length; right++) {
    const char = windowSource[right]
    const code = char.charCodeAt(0)
    cntS[code]++
    steps.push(base({ phase: 'add', left, right, cntS: [...cntS], cntT: [...cntT], ansLeft, ansRight, activePosition: right, activeCode: code, lineId: 'c-add', message: 'r = ' + right + '：\'' + char + '\' 进入窗口，cntS[\'' + char + '\'] = ' + cntS[code] }))
    while (covered(cntS, cntT)) {
      steps.push(base({ phase: 'covered', left, right, cntS: [...cntS], cntT: [...cntT], ansLeft, ansRight, lineId: 'c-while', message: 'cntS 中 A、B、C 的数量都不少于 cntT，当前窗口已经涵盖 t，可以尝试缩短' }))
      if (right - left < ansRight - ansLeft) {
        ansLeft = left
        ansRight = right
        steps.push(base({ phase: 'update', left, right, cntS: [...cntS], cntT: [...cntT], ansLeft, ansRight, lineId: 'c-save-right', message: '当前窗口长度 ' + (right - left + 1) + ' 更短，保存答案 “' + windowSource.slice(ansLeft, ansRight + 1) + '”' }))
      }
      const out = windowSource[left]
      const outCode = out.charCodeAt(0)
      cntS[outCode]--
      steps.push(base({ phase: 'remove', left, right, cntS: [...cntS], cntT: [...cntT], ansLeft, ansRight, activePosition: left, activeCode: outCode, lineId: 'c-remove', message: '移出 l 指向的 \'' + out + '\'，cntS[\'' + out + '\'] 减为 ' + cntS[outCode] }))
      left++
      steps.push(base({ phase: 'move', left, right, cntS: [...cntS], cntT: [...cntT], ansLeft, ansRight, lineId: 'c-move', message: covered(cntS, cntT) ? 'l 右移到 ' + left + '，窗口仍涵盖 t，继续缩短' : 'l 右移到 ' + left + '，窗口不再涵盖 t，等待 r 加入新字符' }))
    }
  }
  steps.push(base({ phase: 'done', left, right: windowSource.length - 1, cntS: [...cntS], cntT: [...cntT], ansLeft, ansRight, lineId: 'c-return', message: '遍历结束，最短覆盖子串是 “' + windowSource.slice(ansLeft, ansRight + 1) + '”' }))
  return steps
}

function makeDiffSteps(): WindowStep[] {
  const diff = blank()
  const steps: WindowStep[] = []
  let kinds = 0
  for (const char of windowTarget) {
    const code = char.charCodeAt(0)
    if (diff[code] === 0) {
      kinds++
      steps.push(base({ diff: [...diff], kinds, activeCode: code, lineId: 'd-kinds-add', message: '\'' + char + '\' 第一次出现，目标字符种类 kinds 增至 ' + kinds }))
    }
    diff[code]--
    steps.push(base({ diff: [...diff], kinds, activeCode: code, lineId: 'd-target', message: 't 中加入 \'' + char + '\'：diff[\'' + char + '\'] = ' + diff[code] + '，不同目标字母 kinds = ' + kinds }))
  }
  let left = 0
  let geCnt = 0
  let ansLeft = -1
  let ansRight = windowSource.length
  for (let right = 0; right < windowSource.length; right++) {
    const char = windowSource[right]
    const code = char.charCodeAt(0)
    diff[code]++
    const reached = diff[code] === 0
    steps.push(base({ phase: 'add', left, right, diff: [...diff], kinds, geCnt, ansLeft, ansRight, activePosition: right, activeCode: code, lineId: 'd-add', message: 'r = ' + right + '：\'' + char + '\' 入窗，先执行 diff[\'' + char + '\']++，结果为 ' + diff[code] }))
    if (reached) {
      geCnt++
      steps.push(base({ phase: 'add', left, right, diff: [...diff], kinds, geCnt, ansLeft, ansRight, activePosition: right, activeCode: code, lineId: 'd-ge-add', message: 'diff[\'' + char + '\'] 恰好变为 0，这种目标字母刚刚够用，geCnt 增至 ' + geCnt }))
    }
    while (geCnt === kinds) {
      steps.push(base({ phase: 'covered', left, right, diff: [...diff], kinds, geCnt, ansLeft, ansRight, lineId: 'd-while', message: 'geCnt = kinds = ' + kinds + '，所有目标字母都已够用，当前窗口涵盖 t' }))
      if (right - left < ansRight - ansLeft) {
        ansLeft = left
        ansRight = right
        steps.push(base({ phase: 'update', left, right, diff: [...diff], kinds, geCnt, ansLeft, ansRight, lineId: 'd-save-right', message: '发现更短窗口，答案更新为 “' + windowSource.slice(ansLeft, ansRight + 1) + '”' }))
      }
      const out = windowSource[left]
      const outCode = out.charCodeAt(0)
      const willBreak = diff[outCode] === 0
      if (willBreak) {
        geCnt--
        steps.push(base({ phase: 'remove', left, right, diff: [...diff], kinds, geCnt, ansLeft, ansRight, activePosition: left, activeCode: outCode, lineId: 'd-ge-remove', message: '\'' + out + '\' 移出前 diff 恰好为 0，移出后会不足，所以先把 geCnt 减为 ' + geCnt }))
      }
      diff[outCode]--
      steps.push(base({ phase: 'remove', left, right, diff: [...diff], kinds, geCnt, ansLeft, ansRight, activePosition: left, activeCode: outCode, lineId: 'd-remove', message: '执行 diff[\'' + out + '\']--，结果为 ' + diff[outCode] + (willBreak ? '，该字母现在不足' : '，该字母仍有余量') }))
      left++
      steps.push(base({ phase: 'move', left, right, diff: [...diff], kinds, geCnt, ansLeft, ansRight, lineId: 'd-move', message: geCnt === kinds ? 'l 右移到 ' + left + '，仍然涵盖，继续缩短' : 'l 右移到 ' + left + '，窗口不再涵盖 t' }))
    }
  }
  steps.push(base({ phase: 'done', left, right: windowSource.length - 1, diff: [...diff], kinds, geCnt, ansLeft, ansRight, lineId: 'd-return', message: '遍历结束，返回 “' + windowSource.slice(ansLeft, ansRight + 1) + '”' }))
  return steps
}

export const makeWindowSteps = (method: WindowMethod) => method === 'counts' ? makeCountsSteps() : makeDiffSteps()

import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type SubstringMethod = 'count' | 'boolean'
export type SubstringPhase = 'ready' | 'add' | 'duplicate' | 'remove' | 'update' | 'done'
export interface SubstringStep {
  left: number
  right: number
  windowRight: number
  tracker: number[]
  activeCode: number
  ans: number
  phase: SubstringPhase
  lineId: string
  message: string
}

export const substringInput = 'abcabcbb'
export const substringMethods: PlayerMethod[] = [
  { id: 'count', label: '整型数组 cnt', complexity: 'O(N) · O(128)' },
  { id: 'boolean', label: '布尔数组 has', complexity: 'O(N) · O(128)' },
]

const countCode: CodeLine[] = [
  { id: 'count-class', text: 'class Solution {' },
  { id: 'count-method', text: '  public int lengthOfLongestSubstring(String S) {' },
  { id: 'count-chars', text: '    char[] s = S.toCharArray();' },
  { id: 'count-n', text: '    int n = s.length;' },
  { id: 'count-ans', text: '    int ans = 0;' },
  { id: 'count-left', text: '    int left = 0;' },
  { id: 'count-array', text: '    int[] cnt = new int[128];' },
  { id: 'count-loop', text: '    for (int right = 0; right < n; right++) {' },
  { id: 'count-char', text: '      char c = s[right];' },
  { id: 'count-add', text: '      cnt[c]++;' },
  { id: 'count-while', text: '      while (cnt[c] > 1) {' },
  { id: 'count-remove', text: '        cnt[s[left]]--;' },
  { id: 'count-move', text: '        left++;' },
  { id: 'count-while-close', text: '      }' },
  { id: 'count-update', text: '      ans = Math.max(ans, right - left + 1);' },
  { id: 'count-loop-close', text: '    }' },
  { id: 'count-return', text: '    return ans;' },
  { id: 'count-method-close', text: '  }' },
  { id: 'count-class-close', text: '}' },
]

const booleanCode: CodeLine[] = [
  { id: 'boolean-class', text: 'class Solution {' },
  { id: 'boolean-method', text: '  public int lengthOfLongestSubstring(String S) {' },
  { id: 'boolean-chars', text: '    char[] s = S.toCharArray();' },
  { id: 'boolean-n', text: '    int n = s.length;' },
  { id: 'boolean-ans', text: '    int ans = 0;' },
  { id: 'boolean-left', text: '    int left = 0;' },
  { id: 'boolean-array', text: '    boolean[] has = new boolean[128];' },
  { id: 'boolean-loop', text: '    for (int right = 0; right < n; right++) {' },
  { id: 'boolean-char', text: '      char c = s[right];' },
  { id: 'boolean-while', text: '      while (has[c]) {' },
  { id: 'boolean-remove', text: '        has[s[left]] = false;' },
  { id: 'boolean-move', text: '        left++;' },
  { id: 'boolean-while-close', text: '      }' },
  { id: 'boolean-add', text: '      has[c] = true;' },
  { id: 'boolean-update', text: '      ans = Math.max(ans, right - left + 1);' },
  { id: 'boolean-loop-close', text: '    }' },
  { id: 'boolean-return', text: '    return ans;' },
  { id: 'boolean-method-close', text: '  }' },
  { id: 'boolean-class-close', text: '}' },
]

export const getSubstringCode = (method: SubstringMethod) => method === 'count' ? countCode : booleanCode
const blank = () => Array<number>(128).fill(0)

function makeCountSteps(): SubstringStep[] {
  const cnt = blank()
  const steps: SubstringStep[] = []
  let left = 0
  let ans = 0
  steps.push({ left, right: -1, windowRight: -1, tracker: [...cnt], activeCode: -1, ans, phase: 'ready', lineId: 'count-array', message: '创建长度为 128 的 cnt 数组，用 ASCII 码作下标；窗口初始为空' })
  for (let right = 0; right < substringInput.length; right++) {
    const code = substringInput.charCodeAt(right)
    const char = substringInput[right]
    cnt[code]++
    steps.push({ left, right, windowRight: right, tracker: [...cnt], activeCode: code, ans, phase: 'add', lineId: 'count-add', message: `right = ${right}：加入 “${char}”，cnt['${char}'] 变为 ${cnt[code]}` })
    while (cnt[code] > 1) {
      steps.push({ left, right, windowRight: right, tracker: [...cnt], activeCode: code, ans, phase: 'duplicate', lineId: 'count-while', message: `cnt['${char}'] = ${cnt[code]} > 1，窗口出现重复；从 left 开始缩小` })
      const removed = substringInput[left]
      const removedCode = substringInput.charCodeAt(left)
      cnt[removedCode]--
      steps.push({ left, right, windowRight: right, tracker: [...cnt], activeCode: removedCode, ans, phase: 'remove', lineId: 'count-remove', message: `移除 s[${left}] = “${removed}”，cnt['${removed}'] 减为 ${cnt[removedCode]}` })
      left++
      steps.push({ left, right, windowRight: right, tracker: [...cnt], activeCode: removedCode, ans, phase: 'remove', lineId: 'count-move', message: `left++，左边界移动到下标 ${left}${cnt[code] > 1 ? '；仍有重复，继续缩小' : '；重复已经消除'}` })
    }
    const length = right - left + 1
    const previous = ans
    ans = Math.max(ans, length)
    steps.push({ left, right, windowRight: right, tracker: [...cnt], activeCode: code, ans, phase: 'update', lineId: 'count-update', message: previous < ans ? `窗口 “${substringInput.slice(left, right + 1)}” 无重复，长度 ${length}，ans 更新为 ${ans}` : `窗口 “${substringInput.slice(left, right + 1)}” 长度 ${length}，ans 保持 ${ans}` })
  }
  steps.push({ left, right: substringInput.length - 1, windowRight: substringInput.length - 1, tracker: [...cnt], activeCode: -1, ans, phase: 'done', lineId: 'count-return', message: `遍历结束，返回最长无重复子串长度 ${ans}` })
  return steps
}

function makeBooleanSteps(): SubstringStep[] {
  const has = blank()
  const steps: SubstringStep[] = []
  let left = 0
  let ans = 0
  steps.push({ left, right: -1, windowRight: -1, tracker: [...has], activeCode: -1, ans, phase: 'ready', lineId: 'boolean-array', message: '创建长度为 128 的 has 数组；true 表示字符已经在当前窗口中' })
  for (let right = 0; right < substringInput.length; right++) {
    const code = substringInput.charCodeAt(right)
    const char = substringInput[right]
    while (has[code] === 1) {
      steps.push({ left, right, windowRight: right - 1, tracker: [...has], activeCode: code, ans, phase: 'duplicate', lineId: 'boolean-while', message: `right = ${right}，准备加入 “${char}”；has['${char}'] 已是 true，必须先移出窗口内原来的 “${char}”` })
      const removed = substringInput[left]
      const removedCode = substringInput.charCodeAt(left)
      has[removedCode] = 0
      steps.push({ left, right, windowRight: right - 1, tracker: [...has], activeCode: removedCode, ans, phase: 'remove', lineId: 'boolean-remove', message: `移除 s[${left}] = “${removed}”，has['${removed}'] 设为 false` })
      left++
      steps.push({ left, right, windowRight: right - 1, tracker: [...has], activeCode: removedCode, ans, phase: 'remove', lineId: 'boolean-move', message: `left++，左边界移动到下标 ${left}${has[code] === 1 ? '；目标字符仍在窗口中，继续移除' : ''}` })
    }
    has[code] = 1
    steps.push({ left, right, windowRight: right, tracker: [...has], activeCode: code, ans, phase: 'add', lineId: 'boolean-add', message: `窗口中已没有 “${char}”，将 has['${char}'] 设为 true，再把它加入窗口` })
    const length = right - left + 1
    const previous = ans
    ans = Math.max(ans, length)
    steps.push({ left, right, windowRight: right, tracker: [...has], activeCode: code, ans, phase: 'update', lineId: 'boolean-update', message: previous < ans ? `窗口 “${substringInput.slice(left, right + 1)}” 长度 ${length}，ans 更新为 ${ans}` : `窗口 “${substringInput.slice(left, right + 1)}” 长度 ${length}，ans 保持 ${ans}` })
  }
  steps.push({ left, right: substringInput.length - 1, windowRight: substringInput.length - 1, tracker: [...has], activeCode: -1, ans, phase: 'done', lineId: 'boolean-return', message: `遍历结束，返回最长无重复子串长度 ${ans}` })
  return steps
}

export const makeSubstringSteps = (method: SubstringMethod) => method === 'count' ? makeCountSteps() : makeBooleanSteps()

import type { CodeLanguage, CodeLine, PlayerMethod } from '../../components/player/types'

export type AnagramMethod = 'fixed' | 'variable'
export type AnagramPhase = 'init' | 'add' | 'grow' | 'compare' | 'remove' | 'excess' | 'shrink' | 'done'
export interface AnagramStep {
  left: number
  right: number
  phase: AnagramPhase
  cntP: number[]
  cntS: number[]
  cnt: number[]
  activeIndex: number
  activePosition: number
  answers: number[]
  lineId: string
  message: string
}

export const sourceText = 'cbaebabacd'
export const patternText = 'abc'
export const anagramMethods: PlayerMethod[] = [
  { id: 'fixed', label: '定长滑窗', complexity: 'O(26N + M)', languages: ['java', 'javascript'] },
  { id: 'variable', label: '不定长滑窗', complexity: 'O(N + M)', languages: ['java'] },
]

const fixedCode: CodeLine[] = [
  { id: 'f-class', text: 'class Solution {' },
  { id: 'f-method', text: '  public List<Integer> findAnagrams(String s, String p) {' },
  { id: 'f-p-array', text: '    int[] cntP = new int[26];' },
  { id: 'f-p-loop', text: '    for (char c : p.toCharArray()) {' },
  { id: 'f-p-add', text: "      cntP[c - 'a']++;" },
  { id: 'f-p-close', text: '    }' },
  { id: 'f-answer', text: '    List<Integer> ans = new ArrayList<>();' },
  { id: 'f-s-array', text: '    int[] cntS = new int[26];' },
  { id: 'f-loop', text: '    for (int right = 0; right < s.length(); right++) {' },
  { id: 'f-add', text: "      cntS[s.charAt(right) - 'a']++;" },
  { id: 'f-left', text: '      int left = right - p.length() + 1;' },
  { id: 'f-short', text: '      if (left < 0) {' },
  { id: 'f-continue', text: '        continue;' },
  { id: 'f-short-close', text: '      }' },
  { id: 'f-equal', text: '      if (Arrays.equals(cntS, cntP)) {' },
  { id: 'f-answer-add', text: '        ans.add(left);' },
  { id: 'f-equal-close', text: '      }' },
  { id: 'f-remove', text: "      cntS[s.charAt(left) - 'a']--;" },
  { id: 'f-loop-close', text: '    }' },
  { id: 'f-return', text: '    return ans;' },
  { id: 'f-method-close', text: '  }' },
  { id: 'f-class-close', text: '}' },
]

const variableCode: CodeLine[] = [
  { id: 'v-class', text: 'class Solution {' },
  { id: 'v-method', text: '  public List<Integer> findAnagrams(String s, String p) {' },
  { id: 'v-array', text: '    int[] cnt = new int[26];' },
  { id: 'v-p-loop', text: '    for (char c : p.toCharArray()) {' },
  { id: 'v-p-add', text: "      cnt[c - 'a']++;" },
  { id: 'v-p-close', text: '    }' },
  { id: 'v-answer', text: '    List<Integer> ans = new ArrayList<>();' },
  { id: 'v-left', text: '    int left = 0;' },
  { id: 'v-loop', text: '    for (int right = 0; right < s.length(); right++) {' },
  { id: 'v-char', text: "      int c = s.charAt(right) - 'a';" },
  { id: 'v-add', text: '      cnt[c]--;' },
  { id: 'v-while', text: '      while (cnt[c] < 0) {' },
  { id: 'v-remove', text: "        cnt[s.charAt(left) - 'a']++;" },
  { id: 'v-move', text: '        left++;' },
  { id: 'v-while-close', text: '      }' },
  { id: 'v-length', text: '      if (right - left + 1 == p.length()) {' },
  { id: 'v-answer-add', text: '        ans.add(left);' },
  { id: 'v-length-close', text: '      }' },
  { id: 'v-loop-close', text: '    }' },
  { id: 'v-return', text: '    return ans;' },
  { id: 'v-method-close', text: '  }' },
  { id: 'v-class-close', text: '}' },
]

const fixedJavascriptCode: CodeLine[] = [
  { id: 'f-method', text: 'function findAnagrams(s, p) {' },
  { id: 'f-answer', text: '    const ans = []' },
  { id: 'f-comment', text: '    // cnt = count' },
  { id: 'f-p-array', text: '    const cntP = new Array(26).fill(0) // 统计 p 的每种字母的出现次数' },
  { id: 'f-s-array', text: "    const cntS = new Array(26).fill(0) // 统计 s 的长为 len(p) 的子串 s' 的每种字母的出现次数" },
  { id: 'f-blank-1', text: '' },
  { id: 'f-p-loop', text: '    for (const c of p) {' },
  { id: 'f-p-add', text: "        cntP[c.charCodeAt() - 'a'.charCodeAt()]++ // 统计 p 的字母" },
  { id: 'f-p-close', text: '    }' },
  { id: 'f-blank-2', text: '' },
  { id: 'f-loop', text: '    for (let right = 0; right < s.length; right++) {' },
  { id: 'f-add', text: "        cntS[s[right].charCodeAt() - 'a'.charCodeAt()]++ // 右端点字母进入窗口" },
  { id: 'f-left', text: '        const left = right - p.length + 1' },
  { id: 'f-short', text: '        if (left < 0) { // 窗口长度不足 len(p)' },
  { id: 'f-continue', text: '            continue' },
  { id: 'f-short-close', text: '        }' },
  { id: 'f-equal', text: "        if (_.isEqual(cntS, cntP)) { // s' 和 p 的每种字母的出现次数都相同" },
  { id: 'f-answer-add', text: "            ans.push(left) // s' 左端点下标加入答案" },
  { id: 'f-equal-close', text: '        }' },
  { id: 'f-remove', text: "        cntS[s[left].charCodeAt() - 'a'.charCodeAt()]-- // 左端点字母离开窗口" },
  { id: 'f-loop-close', text: '    }' },
  { id: 'f-blank-3', text: '' },
  { id: 'f-return', text: '    return ans' },
  { id: 'f-method-close', text: '}' },
]

export const getAnagramCode = (method: AnagramMethod, language: CodeLanguage) => method === 'fixed' ? language === 'javascript' ? fixedJavascriptCode : fixedCode : variableCode
const blank = () => Array<number>(26).fill(0)
const snapshot = (values: number[]) => [...values]

function makeStep(values: Partial<AnagramStep>): AnagramStep {
  return { left: 0, right: -1, phase: 'init', cntP: blank(), cntS: blank(), cnt: blank(), activeIndex: -1, activePosition: -1, answers: [], lineId: '', message: '', ...values }
}

function makeFixedSteps(): AnagramStep[] {
  const cntP = blank()
  const cntS = blank()
  const answers: number[] = []
  const steps: AnagramStep[] = []
  for (const char of patternText) {
    const index = char.charCodeAt(0) - 97
    cntP[index]++
    steps.push(makeStep({ cntP: snapshot(cntP), cntS: snapshot(cntS), activeIndex: index, lineId: 'f-p-add', message: `统计 p：字母 “${char}” 的目标次数变为 ${cntP[index]}` }))
  }
  for (let right = 0; right < sourceText.length; right++) {
    const incoming = sourceText[right]
    const incomingIndex = incoming.charCodeAt(0) - 97
    cntS[incomingIndex]++
    const left = right - patternText.length + 1
    steps.push(makeStep({ left: Math.max(0, left), right, phase: 'add', cntP: snapshot(cntP), cntS: snapshot(cntS), activeIndex: incomingIndex, activePosition: right, answers: [...answers], lineId: 'f-add', message: `r = ${right}：只让 s[${right}] = “${incoming}” 进入窗口；cntS 记录窗口实际数量，所以 cntS['${incoming}'] 变为 ${cntS[incomingIndex]}` }))
    if (left < 0) {
      steps.push(makeStep({ left: 0, right, phase: 'grow', cntP: snapshot(cntP), cntS: snapshot(cntS), activeIndex: incomingIndex, activePosition: right, answers: [...answers], lineId: 'f-continue', message: `l = ${right} - ${patternText.length} + 1 = ${left}，窗口长度还不足 ${patternText.length}，暂不比较，继续向右加入字符` }))
      continue
    }
    const match = cntS.every((value, index) => value === cntP[index])
    if (match) answers.push(left)
    steps.push(makeStep({ left, right, phase: 'compare', cntP: snapshot(cntP), cntS: snapshot(cntS), activeIndex: -1, answers: [...answers], lineId: match ? 'f-answer-add' : 'f-equal', message: match ? `窗口 “${sourceText.slice(left, right + 1)}” 的 26 个计数都与 p 相同，记录起点 ${left}` : `窗口 “${sourceText.slice(left, right + 1)}” 已满，但计数表不同，不记录` }))
    const outgoing = sourceText[left]
    const outgoingIndex = outgoing.charCodeAt(0) - 97
    cntS[outgoingIndex]--
    steps.push(makeStep({ left: left + 1, right, phase: 'remove', cntP: snapshot(cntP), cntS: snapshot(cntS), activeIndex: outgoingIndex, activePosition: left, answers: [...answers], lineId: 'f-remove', message: `本轮比较结束，只移出 s[${left}] = “${outgoing}”；cntS['${outgoing}'] 减为 ${cntS[outgoingIndex]}，为下一个长度为 ${patternText.length} 的窗口腾出位置` }))
  }
  steps.push(makeStep({ left: sourceText.length, right: sourceText.length - 1, phase: 'done', cntP: snapshot(cntP), cntS: snapshot(cntS), answers: [...answers], lineId: 'f-return', message: '所有长度为 3 的窗口检查完成，返回 [0, 6]' }))
  return steps
}

function makeVariableSteps(): AnagramStep[] {
  const cnt = blank()
  const answers: number[] = []
  const steps: AnagramStep[] = []
  for (const char of patternText) {
    const index = char.charCodeAt(0) - 97
    cnt[index]++
    steps.push(makeStep({ cnt: snapshot(cnt), activeIndex: index, lineId: 'v-p-add', message: `给 p 的字母分配配额：“${char}” 还可进入窗口 ${cnt[index]} 次` }))
  }
  let left = 0
  for (let right = 0; right < sourceText.length; right++) {
    const incoming = sourceText[right]
    const c = incoming.charCodeAt(0) - 97
    cnt[c]--
    steps.push(makeStep({ left, right, phase: 'add', cnt: snapshot(cnt), activeIndex: c, activePosition: right, answers: [...answers], lineId: 'v-add', message: `r = ${right}：只让 s[${right}] = “${incoming}” 进入窗口，消耗一次目标配额；cnt['${incoming}'] 变为 ${cnt[c]}` }))
    while (cnt[c] < 0) {
      steps.push(makeStep({ left, right, phase: 'excess', cnt: snapshot(cnt), activeIndex: c, activePosition: right, answers: [...answers], lineId: 'v-while', message: `cnt['${incoming}'] = ${cnt[c]} < 0，说明刚进入的 s[${right}] 让 “${incoming}” 超量；移动 l 直到它不再超量` }))
      const outgoing = sourceText[left]
      const outgoingIndex = outgoing.charCodeAt(0) - 97
      cnt[outgoingIndex]++
      steps.push(makeStep({ left, right, phase: 'shrink', cnt: snapshot(cnt), activeIndex: outgoingIndex, activePosition: left, answers: [...answers], lineId: 'v-remove', message: `只移出 l 指向的 s[${left}] = “${outgoing}”，归还一次 “${outgoing}” 的配额` }))
      left++
      steps.push(makeStep({ left, right, phase: 'shrink', cnt: snapshot(cnt), activeIndex: outgoingIndex, answers: [...answers], lineId: 'v-move', message: `left++，窗口左边界移动到下标 ${left}${cnt[c] < 0 ? '；“' + incoming + '” 仍然超量，继续收缩' : '；窗口重新合法'}` }))
    }
    const match = right - left + 1 === patternText.length
    if (match) answers.push(left)
    steps.push(makeStep({ left, right, phase: 'compare', cnt: snapshot(cnt), activeIndex: -1, answers: [...answers], lineId: match ? 'v-answer-add' : 'v-length', message: match ? `窗口内每种字母都未超量，且长度正好为 ${patternText.length}，所以一定是异位词；记录起点 ${left}` : `窗口合法，但长度为 ${right - left + 1}，还不是长度 ${patternText.length} 的异位词` }))
  }
  steps.push(makeStep({ left, right: sourceText.length - 1, phase: 'done', cnt: snapshot(cnt), answers: [...answers], lineId: 'v-return', message: '遍历结束，返回全部匹配起点 [0, 6]' }))
  return steps
}

export const makeAnagramSteps = (method: AnagramMethod) => method === 'fixed' ? makeFixedSteps() : makeVariableSteps()

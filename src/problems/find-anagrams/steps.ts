import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type AnagramMethod = 'counts' | 'differ'
export type AnagramPhase = 'init' | 'remove' | 'add' | 'compare' | 'done'
export interface AnagramStep { start: number; phase: AnagramPhase; sCount: number[]; pCount: number[]; count: number[]; differ: number; outgoing: number; incoming: number; answers: number[]; lineId: string; message: string }

export const sourceText = 'cbaebabacd'
export const patternText = 'abc'
export const anagramMethods: PlayerMethod[] = [
  { id: 'counts', label: '双计数数组', complexity: 'O((N-M)×26)' },
  { id: 'differ', label: 'differ 优化', complexity: 'O(N+M+26)' },
]

const countsCode: CodeLine[] = [
  { id: 'c-class', text: 'class Solution {' },
  { id: 'c-method', text: '  public List<Integer> findAnagrams(String s, String p) {' },
  { id: 'c-lens', text: '    int sLen = s.length(), pLen = p.length();' },
  { id: 'c-short', text: '    if (sLen < pLen) {' },
  { id: 'c-empty', text: '      return new ArrayList<Integer>();' },
  { id: 'c-short-close', text: '    }' },
  { id: 'c-answer', text: '    List<Integer> ans = new ArrayList<Integer>();' },
  { id: 'c-arrays', text: '    int[] sCount = new int[26];' },
  { id: 'c-p-array', text: '    int[] pCount = new int[26];' },
  { id: 'c-init-loop', text: '    for (int i = 0; i < pLen; ++i) {' },
  { id: 'c-init-s', text: "      ++sCount[s.charAt(i) - 'a'];" },
  { id: 'c-init-p', text: "      ++pCount[p.charAt(i) - 'a'];" },
  { id: 'c-init-close', text: '    }' },
  { id: 'c-first-equal', text: '    if (Arrays.equals(sCount, pCount)) {' },
  { id: 'c-first-add', text: '      ans.add(0);' },
  { id: 'c-first-close', text: '    }' },
  { id: 'c-loop', text: '    for (int i = 0; i < sLen - pLen; ++i) {' },
  { id: 'c-remove', text: "      --sCount[s.charAt(i) - 'a'];" },
  { id: 'c-add', text: "      ++sCount[s.charAt(i + pLen) - 'a'];" },
  { id: 'c-equal', text: '      if (Arrays.equals(sCount, pCount)) {' },
  { id: 'c-answer-add', text: '        ans.add(i + 1);' },
  { id: 'c-equal-close', text: '      }' },
  { id: 'c-loop-close', text: '    }' },
  { id: 'c-return', text: '    return ans;' },
  { id: 'c-method-close', text: '  }' },
  { id: 'c-class-close', text: '}' },
]

const differCode: CodeLine[] = [
  { id: 'd-class', text: 'class Solution {' },
  { id: 'd-method', text: '  public List<Integer> findAnagrams(String s, String p) {' },
  { id: 'd-lens', text: '    int sLen = s.length(), pLen = p.length();' },
  { id: 'd-short', text: '    if (sLen < pLen) {' },
  { id: 'd-empty', text: '      return new ArrayList<Integer>();' },
  { id: 'd-short-close', text: '    }' },
  { id: 'd-answer', text: '    List<Integer> ans = new ArrayList<Integer>();' },
  { id: 'd-array', text: '    int[] count = new int[26];' },
  { id: 'd-init-loop', text: '    for (int i = 0; i < pLen; ++i) {' },
  { id: 'd-init-s', text: "      ++count[s.charAt(i) - 'a'];" },
  { id: 'd-init-p', text: "      --count[p.charAt(i) - 'a'];" },
  { id: 'd-init-close', text: '    }' },
  { id: 'd-differ', text: '    int differ = 0;' },
  { id: 'd-differ-loop', text: '    for (int j = 0; j < 26; ++j) {' },
  { id: 'd-nonzero', text: '      if (count[j] != 0) {' },
  { id: 'd-differ-add', text: '        ++differ;' },
  { id: 'd-nonzero-close', text: '      }' },
  { id: 'd-differ-close', text: '    }' },
  { id: 'd-first', text: '    if (differ == 0) {' },
  { id: 'd-first-add', text: '      ans.add(0);' },
  { id: 'd-first-close', text: '    }' },
  { id: 'd-loop', text: '    for (int i = 0; i < sLen - pLen; ++i) {' },
  { id: 'd-remove-one', text: "      if (count[s.charAt(i) - 'a'] == 1) {" },
  { id: 'd-remove-same', text: '        --differ;' },
  { id: 'd-remove-zero', text: "      } else if (count[s.charAt(i) - 'a'] == 0) {" },
  { id: 'd-remove-diff', text: '        ++differ;' },
  { id: 'd-remove-close', text: '      }' },
  { id: 'd-remove', text: "      --count[s.charAt(i) - 'a'];" },
  { id: 'd-add-minus', text: "      if (count[s.charAt(i + pLen) - 'a'] == -1) {" },
  { id: 'd-add-same', text: '        --differ;' },
  { id: 'd-add-zero', text: "      } else if (count[s.charAt(i + pLen) - 'a'] == 0) {" },
  { id: 'd-add-diff', text: '        ++differ;' },
  { id: 'd-add-close', text: '      }' },
  { id: 'd-add', text: "      ++count[s.charAt(i + pLen) - 'a'];" },
  { id: 'd-equal', text: '      if (differ == 0) {' },
  { id: 'd-answer-add', text: '        ans.add(i + 1);' },
  { id: 'd-equal-close', text: '      }' },
  { id: 'd-loop-close', text: '    }' },
  { id: 'd-return', text: '    return ans;' },
  { id: 'd-method-close', text: '  }' },
  { id: 'd-class-close', text: '}' },
]

export const getAnagramCode = (method: AnagramMethod) => method === 'counts' ? countsCode : differCode
const blank = () => Array<number>(26).fill(0)
const copy = (values: number[]) => [...values]

function baseStep(values: Partial<AnagramStep>): AnagramStep {
  return { start: 0, phase: 'init', sCount: blank(), pCount: blank(), count: blank(), differ: 0, outgoing: -1, incoming: -1, answers: [], lineId: '', message: '', ...values }
}

function makeCountsSteps(): AnagramStep[] {
  const sCount = blank(), pCount = blank(), answers: number[] = [], steps: AnagramStep[] = []
  for (let i = 0; i < patternText.length; i++) { sCount[sourceText.charCodeAt(i) - 97]++; pCount[patternText.charCodeAt(i) - 97]++ }
  steps.push(baseStep({ sCount: copy(sCount), pCount: copy(pCount), lineId: 'c-init-p', message: `初始化长度为 ${patternText.length} 的窗口 “${sourceText.slice(0, patternText.length)}”，并统计它与 p 的 26 位字母次数` }))
  const firstMatch = sCount.every((value, index) => value === pCount[index])
  if (firstMatch) answers.push(0)
  steps.push(baseStep({ phase: 'compare', sCount: copy(sCount), pCount: copy(pCount), answers: [...answers], lineId: firstMatch ? 'c-first-add' : 'c-first-equal', message: firstMatch ? '两张计数表完全相同，窗口 “cba” 是异位词，记录起点 0' : '两张计数表不同，不记录' }))
  for (let i = 0; i < sourceText.length - patternText.length; i++) {
    const outgoing = i, incoming = i + patternText.length, start = i + 1
    sCount[sourceText.charCodeAt(outgoing) - 97]--
    steps.push(baseStep({ start, phase: 'remove', sCount: copy(sCount), pCount: copy(pCount), outgoing, incoming, answers: [...answers], lineId: 'c-remove', message: `窗口右移：先移出 s[${outgoing}] = “${sourceText[outgoing]}”，它的计数减 1` }))
    sCount[sourceText.charCodeAt(incoming) - 97]++
    steps.push(baseStep({ start, phase: 'add', sCount: copy(sCount), pCount: copy(pCount), outgoing, incoming, answers: [...answers], lineId: 'c-add', message: `再移入 s[${incoming}] = “${sourceText[incoming]}”，得到新窗口 “${sourceText.slice(start, start + patternText.length)}”` }))
    const match = sCount.every((value, index) => value === pCount[index])
    if (match) answers.push(start)
    steps.push(baseStep({ start, phase: 'compare', sCount: copy(sCount), pCount: copy(pCount), outgoing, incoming, answers: [...answers], lineId: match ? 'c-answer-add' : 'c-equal', message: match ? `26 个位置全部相同：记录窗口起点 ${start}` : '计数表仍有不同，这个窗口不是 p 的异位词' }))
  }
  steps.push(baseStep({ start: sourceText.length - patternText.length, phase: 'done', sCount: copy(sCount), pCount: copy(pCount), answers, lineId: 'c-return', message: '所有固定长度窗口检查完成，返回 [0, 6]' }))
  return steps
}

function makeDifferSteps(): AnagramStep[] {
  const count = blank(), answers: number[] = [], steps: AnagramStep[] = []
  for (let i = 0; i < patternText.length; i++) { count[sourceText.charCodeAt(i) - 97]++; count[patternText.charCodeAt(i) - 97]-- }
  let differ = count.filter((value) => value !== 0).length
  steps.push(baseStep({ count: copy(count), differ, lineId: 'd-differ-add', message: `count = 窗口计数 − p 计数；非零字母种类数 differ = ${differ}` }))
  if (differ === 0) answers.push(0)
  steps.push(baseStep({ phase: 'compare', count: copy(count), differ, answers: [...answers], lineId: 'd-first-add', message: 'differ = 0，表示 26 个差值全为 0，记录起点 0' }))
  for (let i = 0; i < sourceText.length - patternText.length; i++) {
    const outgoing = i, incoming = i + patternText.length, start = i + 1
    const outIndex = sourceText.charCodeAt(outgoing) - 97, outBefore = count[outIndex], differBeforeRemove = differ
    if (count[outIndex] === 1) differ--; else if (count[outIndex] === 0) differ++
    count[outIndex]--
    steps.push(baseStep({ start, phase: 'remove', count: copy(count), differ, outgoing, incoming, answers: [...answers], lineId: 'd-remove', message: `移出 “${sourceText[outgoing]}”：差值 ${outBefore} → ${count[outIndex]}，differ ${differBeforeRemove} → ${differ}` }))
    const inIndex = sourceText.charCodeAt(incoming) - 97, inBefore = count[inIndex], differBeforeAdd = differ
    if (count[inIndex] === -1) differ--; else if (count[inIndex] === 0) differ++
    count[inIndex]++
    steps.push(baseStep({ start, phase: 'add', count: copy(count), differ, outgoing, incoming, answers: [...answers], lineId: 'd-add', message: `移入 “${sourceText[incoming]}”：差值 ${inBefore} → ${count[inIndex]}，differ ${differBeforeAdd} → ${differ}` }))
    if (differ === 0) answers.push(start)
    steps.push(baseStep({ start, phase: 'compare', count: copy(count), differ, outgoing, incoming, answers: [...answers], lineId: differ === 0 ? 'd-answer-add' : 'd-equal', message: differ === 0 ? `differ = 0，只需 O(1) 判断即可记录起点 ${start}` : `differ = ${differ}，仍有 ${differ} 种字母数量不同` }))
  }
  steps.push(baseStep({ start: sourceText.length - patternText.length, phase: 'done', count: copy(count), differ, answers, lineId: 'd-return', message: '滑动完成，返回所有匹配起点 [0, 6]' }))
  return steps
}

export const makeAnagramSteps = (method: AnagramMethod) => method === 'counts' ? makeCountsSteps() : makeDifferSteps()

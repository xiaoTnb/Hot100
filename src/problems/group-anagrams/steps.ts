import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type GroupMethod = 'sort' | 'count'
export type GroupPhase = 'select' | 'transform' | 'key' | 'lookup' | 'add' | 'done'
export type Group = Record<string, string[]>
export type Counts = number[]

export interface GroupStep {
  wordIndex: number
  word: string
  key: string
  counts: Counts
  groups: Group
  phase: GroupPhase
  exists: boolean
  message: string
  lineId: string
}

export const groupWords = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']

export const groupMethods: PlayerMethod[] = [
  { id: 'sort', label: '排序作为 key', complexity: 'O(NK logK)' },
  { id: 'count', label: '计数作为 key', complexity: 'O(N(K+26))' },
]

const sortCode: CodeLine[] = [
  { id: 'sort-class', text: 'class Solution {' },
  { id: 'sort-method', text: '  public List<List<String>> groupAnagrams(String[] strs) {' },
  { id: 'sort-create-map', text: '    Map<String, List<String>> map = new HashMap<String, List<String>>();' },
  { id: 'sort-loop', text: '    for (String str : strs) {' },
  { id: 'sort-to-array', text: '      char[] array = str.toCharArray();' },
  { id: 'sort-chars', text: '      Arrays.sort(array);' },
  { id: 'sort-key', text: '      String key = new String(array);' },
  { id: 'sort-lookup', text: '      List<String> list = map.getOrDefault(key, new ArrayList<String>());' },
  { id: 'sort-add', text: '      list.add(str);' },
  { id: 'sort-store', text: '      map.put(key, list);' },
  { id: 'sort-loop-close', text: '    }' },
  { id: 'sort-return', text: '    return new ArrayList<List<String>>(map.values());' },
  { id: 'sort-method-close', text: '  }' },
  { id: 'sort-class-close', text: '}' },
]

const countCode: CodeLine[] = [
  { id: 'count-class', text: 'class Solution {' },
  { id: 'count-method', text: '  public List<List<String>> groupAnagrams(String[] strs) {' },
  { id: 'count-create-map', text: '    Map<String, List<String>> map = new HashMap<String, List<String>>();' },
  { id: 'count-loop', text: '    for (String str : strs) {' },
  { id: 'count-create-array', text: '      int[] counts = new int[26];' },
  { id: 'count-length', text: '      int length = str.length();' },
  { id: 'count-char-loop', text: '      for (int i = 0; i < length; i++) {' },
  { id: 'count-increment', text: "        counts[str.charAt(i) - 'a']++;" },
  { id: 'count-char-close', text: '      }' },
  { id: 'count-buffer', text: '      StringBuffer sb = new StringBuffer();' },
  { id: 'count-key-loop', text: '      for (int i = 0; i < 26; i++) {' },
  { id: 'count-nonzero', text: '        if (counts[i] != 0) {' },
  { id: 'count-append-char', text: "          sb.append((char) ('a' + i));" },
  { id: 'count-append-value', text: '          sb.append(counts[i]);' },
  { id: 'count-if-close', text: '        }' },
  { id: 'count-key-loop-close', text: '      }' },
  { id: 'count-key', text: '      String key = sb.toString();' },
  { id: 'count-lookup', text: '      List<String> list = map.getOrDefault(key, new ArrayList<String>());' },
  { id: 'count-add', text: '      list.add(str);' },
  { id: 'count-store', text: '      map.put(key, list);' },
  { id: 'count-loop-close', text: '    }' },
  { id: 'count-return', text: '    return new ArrayList<List<String>>(map.values());' },
  { id: 'count-method-close', text: '  }' },
  { id: 'count-class-close', text: '}' },
]

export const groupPhaseNames: Record<GroupPhase, string> = {
  select: '取出字符串', transform: '生成标记', key: '得到 key', lookup: '查询分组', add: '放入分组', done: '得到结果',
}

export function getGroupCode(method: GroupMethod): CodeLine[] {
  return method === 'sort' ? sortCode : countCode
}

function copyGroups(groups: Group): Group {
  return Object.fromEntries(Object.entries(groups).map(([key, values]) => [key, [...values]]))
}

export function countLetters(word: string): Counts {
  const counts = Array<number>(26).fill(0)
  for (const letter of word) counts[letter.charCodeAt(0) - 97]++
  return counts
}

export function nonzeroCounts(counts: Counts): Array<[string, number]> {
  return counts.flatMap((count, index) => count === 0 ? [] : [[String.fromCharCode(97 + index), count]])
}

function makeKey(word: string, method: GroupMethod) {
  const counts = countLetters(word)
  return { counts, key: method === 'sort' ? [...word].sort().join('') : nonzeroCounts(counts).map(([letter, count]) => `${letter}${count}`).join('') }
}

export function makeGroupSteps(method: GroupMethod): GroupStep[] {
  const groups: Group = {}
  const steps: GroupStep[] = []

  groupWords.forEach((word, wordIndex) => {
    const { key, counts } = makeKey(word, method)
    const before = copyGroups(groups)
    const exists = Boolean(groups[key])
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'select', lineId: method === 'sort' ? 'sort-loop' : 'count-loop', message: `取出第 ${wordIndex + 1} 个字符串 “${word}”` })
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'transform', lineId: method === 'sort' ? 'sort-chars' : 'count-increment', message: method === 'sort' ? `把 “${word}” 按字母排序` : `在长度为 26 的 counts 数组中，累计 “${word}” 每个字母的出现次数` })
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'key', lineId: method === 'sort' ? 'sort-key' : 'count-append-char', message: method === 'sort' ? `排序结果 “${key}” 作为哈希表的 key` : `只拼接非零的字母和次数，得到 key = “${key}”` })
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'lookup', lineId: method === 'sort' ? 'sort-lookup' : 'count-lookup', message: exists ? `找到已有 key “${key}” 的分组` : `没有 key “${key}” 的分组，准备新建桶` })
    if (!groups[key]) groups[key] = []
    groups[key].push(word)
    steps.push({ wordIndex, word, key, counts, groups: copyGroups(groups), exists, phase: 'add', lineId: method === 'sort' ? 'sort-add' : 'count-add', message: `把原字符串 “${word}” 放进 key 为 “${key}” 的分组，再写回哈希表` })
  })

  steps.push({ wordIndex: groupWords.length - 1, word: '', key: '', counts: Array<number>(26).fill(0), groups: copyGroups(groups), exists: false, phase: 'done', lineId: method === 'sort' ? 'sort-return' : 'count-return', message: '遍历完成：哈希表的每个桶，就是一组字母异位词' })
  return steps
}

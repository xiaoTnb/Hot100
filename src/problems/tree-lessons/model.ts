import type { CodeLine, PlayerMethod } from '../../components/player/types'

export interface LessonNode {
  id: number
  value: number
  left: number | null
  right: number | null
}

export interface LessonRow {
  label: string
  items: string[]
  tone?: 'blue' | 'orange' | 'green'
}

export interface TreeFrame {
  nodes: LessonNode[]
  root: number | null
  active: number[]
  completed: number[]
  path?: number[]
  stack: string[]
  variables: [string, string][]
  rows: LessonRow[]
  lineId: string
  title: string
  message: string
  done?: boolean
  failed?: boolean
}

export interface TreeScenario {
  id: string
  label: string
  input: (number | null)[]
}

export interface TreeLessonMethod extends PlayerMethod {
  code: CodeLine[]
}

export interface TreeLesson {
  methods: TreeLessonMethod[]
  scenarios: TreeScenario[]
  makeFrames: (method: string, scenario: TreeScenario) => TreeFrame[]
  legend: string
}

// The @name| prefix names an executable Java line for animation highlighting.
export function java(source: string): CodeLine[] {
  return source.trim().split('\n').map((line, index) => {
    const match = /^@([\w-]+)\|(.*)$/.exec(line)
    return { id: match?.[1] ?? `line-${index}`, text: match?.[2] ?? line }
  })
}

export function treeFromLevelOrder(values: (number | null)[]) {
  const nodes: LessonNode[] = []
  if (values[0] == null) return { nodes, root: null }
  nodes.push({ id: 0, value: values[0], left: null, right: null })
  let next = 1
  for (let index = 0; index < nodes.length && next < values.length; index++) {
    for (const side of ['left', 'right'] as const) {
      const value = values[next++]
      if (value == null) continue
      const id = nodes.length
      nodes[index][side] = id
      nodes.push({ id, value, left: null, right: null })
    }
  }
  return { nodes, root: 0 }
}

export function recorder(input: (number | null)[]) {
  const { nodes, root } = treeFromLevelOrder(input)
  const frames: TreeFrame[] = []
  const completed: number[] = []
  const stack: string[] = []
  const name = (id: number | null) => id === null ? 'null' : String(nodes[id].value)
  function push(lineId: string, title: string, message: string, rest: Partial<TreeFrame> = {}) {
    frames.push({ nodes: nodes.map(node => ({ ...node })), root, active: [], completed: [...completed], stack: [...stack], variables: [], rows: [], lineId, title, message, ...rest })
  }
  return { nodes, root, frames, completed, stack, name, push }
}

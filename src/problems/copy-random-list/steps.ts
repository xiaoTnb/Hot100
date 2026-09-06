import type { CodeLine, PlayerMethod } from '../../components/player/types'
export interface CopyStep { phase:'start'|'weave'|'random'|'split'|'done'; count:number; active:number; lineId:string; message:string }
export const copyValues=[7,13,11,10,1], copyRandom:(number|null)[]=[null,0,4,2,0]
export const copyMethods:PlayerMethod[]=[{id:'weave',label:'交错复制',complexity:'O(N) · O(1)',languages:['javascript']}]
export const copyCode:CodeLine[]=[
 {id:'function',text:'var copyRandomList = function (head) {'},{id:'null',text:'  if (head === null) return null'},{id:'weave-loop',text:'  for (let cur = head; cur; cur = cur.next.next) {'},{id:'weave',text:'    cur.next = new _Node(cur.val, cur.next, null)'},{id:'weave-close',text:'  }'},{id:'random-loop',text:'  for (let cur = head; cur; cur = cur.next.next) {'},{id:'random-if',text:'    if (cur.random) {'},{id:'random',text:'      cur.next.random = cur.random.next'},{id:'random-close',text:'    }'},{id:'random-loop-close',text:'  }'},{id:'new-head',text:'  const newHead = head.next'},{id:'split-init',text:'  let cur = head'},{id:'split-loop',text:'  for (; cur.next.next; cur = cur.next) {'},{id:'copy',text:'    const copy = cur.next'},{id:'restore',text:'    cur.next = copy.next'},{id:'split',text:'    copy.next = copy.next.next'},{id:'split-close',text:'  }'},{id:'tail',text:'  cur.next = null'},{id:'return',text:'  return newHead'},{id:'end',text:'};'},
]
export const copySteps:CopyStep[]=[
 {phase:'start',count:0,active:0,lineId:'function',message:'原链表包含 5 个节点；每个 random 可能指向任意原节点或 null'},
 {phase:'weave',count:2,active:1,lineId:'weave',message:'为前两个原节点创建副本，并紧邻插入：O₀ → C₀ → O₁ → C₁'},
 {phase:'weave',count:5,active:4,lineId:'weave-close',message:'所有副本都已插入，原节点与副本一一相邻'},
 {phase:'random',count:2,active:1,lineId:'random',message:'设置副本 random：C₁.random = O₁.random.next = C₀'},
 {phase:'random',count:5,active:4,lineId:'random-loop-close',message:'借助相邻关系，为所有副本设置了只指向副本的 random'},
 {phase:'split',count:2,active:1,lineId:'split',message:'逐对恢复原链表 next，同时把副本 next 指向下一个副本'},
 {phase:'split',count:5,active:4,lineId:'tail',message:'两条链表完全拆开；原链表结构已经恢复'},
 {phase:'done',count:5,active:-1,lineId:'return',message:'返回 newHead：副本值与指针结构相同，但节点引用全部独立'},
]

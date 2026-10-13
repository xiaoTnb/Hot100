import type { CodeLine, PlayerMethod } from '../../components/player/types'
export interface CopyStep { phase:'start'|'weave'|'random'|'split'|'done'; count:number; active:number; lineId:string; message:string }
export const copyValues=[7,13,11,10,1], copyRandom:(number|null)[]=[null,0,4,2,0]
export const copyMethods:PlayerMethod[]=[{id:'weave',label:'交错复制 · 原地映射',complexity:'O(N) · O(1)',languages:['java']}]
export const copyCode:CodeLine[]=[
 {id:'function',text:'class Solution {'},{id:'method',text:'  public Node copyRandomList(Node head) {'},{id:'weave-loop',text:'    for (Node cur = head; cur != null; cur = cur.next.next) {'},{id:'weave',text:'      cur.next = new Node(cur.val, cur.next);'},{id:'weave-close',text:'    }'},{id:'random-loop',text:'    for (Node cur = head; cur != null; cur = cur.next.next) {'},{id:'random-if',text:'      if (cur.random != null) {'},{id:'random',text:'        cur.next.random = cur.random.next;'},{id:'random-close',text:'      }'},{id:'random-loop-close',text:'    }'},{id:'dummy',text:'    Node dummy = new Node(0);'},{id:'tail',text:'    Node tail = dummy;'},{id:'split-loop',text:'    for (Node cur = head; cur != null; cur = cur.next, tail = tail.next) {'},{id:'copy',text:'      Node copy = cur.next;'},{id:'split',text:'      tail.next = copy;'},{id:'restore',text:'      cur.next = copy.next;'},{id:'split-close',text:'    }'},{id:'return',text:'    return dummy.next;'},{id:'end',text:'  }'},{id:'class-end',text:'}'},
]
export const copySteps:CopyStep[]=[
 {phase:'start',count:0,active:0,lineId:'function',message:'原链表包含 5 个节点；每个 random 可能指向任意原节点或 null'},
 {phase:'weave',count:1,active:0,lineId:'weave',message:'复制 O₀，并把 C₀ 紧邻插在 O₀ 后面'},
 {phase:'weave',count:2,active:1,lineId:'weave',message:'复制 O₁：交错链表新增 O₁ → C₁'},
 {phase:'weave',count:3,active:2,lineId:'weave',message:'复制 O₂：原节点的 next 就是对应副本'},
 {phase:'weave',count:4,active:3,lineId:'weave',message:'复制 O₃，并继续保持 O / C 交错排列'},
 {phase:'weave',count:5,active:4,lineId:'weave-close',message:'复制 O₄；所有原节点与副本已一一相邻'},
 {phase:'random',count:1,active:0,lineId:'random-if',message:'O₀.random = null，所以 C₀.random 也保持 null'},
 {phase:'random',count:2,active:1,lineId:'random',message:'C₁.random = O₁.random.next = O₀.next = C₀'},
 {phase:'random',count:3,active:2,lineId:'random',message:'C₂.random = O₄.next = C₄，只指向副本节点'},
 {phase:'random',count:4,active:3,lineId:'random',message:'C₃.random = O₂.next = C₂'},
 {phase:'random',count:5,active:4,lineId:'random-loop-close',message:'C₄.random = O₀.next = C₀；random 全部复制完成'},
 {phase:'split',count:1,active:0,lineId:'restore',message:'取出 C₀ 接到新链表，并恢复 O₀.next = O₁'},
 {phase:'split',count:2,active:1,lineId:'restore',message:'取出 C₁；原链和副本链各自向后延伸'},
 {phase:'split',count:3,active:2,lineId:'restore',message:'取出 C₂，同时恢复 O₂ 的原始 next'},
 {phase:'split',count:4,active:3,lineId:'restore',message:'取出 C₃，两条链表继续分离'},
 {phase:'split',count:5,active:4,lineId:'split-close',message:'取出 C₄；原链表完全恢复，副本链表独立'},
 {phase:'done',count:5,active:-1,lineId:'return',message:'返回 dummy.next：副本值与指针结构相同，但节点引用全部独立'},
]

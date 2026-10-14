import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type MergeKMethod = 'heap' | 'recursive' | 'iterative'
export interface HeapItem { value:number; source:number }
export interface MergeKStep {
  phase:'input'|'heap'|'pop'|'split'|'merge'|'done'
  lists:(number[]|null)[]
  heap:HeapItem[]
  result:number[]
  range?:string
  stepSize?:number
  lineId:string
  message:string
}

export const mergeKMethods:PlayerMethod[] = [
  {id:'heap',label:'最小堆',complexity:'O(N log K) · O(K)',languages:['java']},
  {id:'recursive',label:'递归分治',complexity:'O(N log K) · O(log K)',languages:['java']},
  {id:'iterative',label:'迭代分治',complexity:'O(N log K) · O(1)',languages:['java']},
]

const mergeHelper:CodeLine[] = [
  {id:'x-merge',text:'  private ListNode mergeTwoLists(ListNode a, ListNode b) {'},
  {id:'x-dummy',text:'    ListNode dummy = new ListNode(), cur = dummy;'},
  {id:'x-loop',text:'    while (a != null && b != null) {'},
  {id:'x-pick',text:'      if (a.val <= b.val) { cur.next = a; a = a.next; }'},
  {id:'x-else',text:'      else { cur.next = b; b = b.next; }'},
  {id:'x-cur',text:'      cur = cur.next;'},
  {id:'x-loop-end',text:'    }'},
  {id:'x-rest',text:'    cur.next = a != null ? a : b;'},
  {id:'x-return',text:'    return dummy.next;'},
  {id:'x-end',text:'  }'},
]

const heapCode:CodeLine[] = [
  {id:'h-import',text:'import java.util.*;'},
  {id:'h-class',text:'class Solution {'},
  {id:'h-method',text:'  public ListNode mergeKLists(ListNode[] lists) {'},
  {id:'h-pq',text:'    PriorityQueue<ListNode> pq = new PriorityQueue<>((a,b) -> Integer.compare(a.val, b.val));'},
  {id:'h-init',text:'    for (ListNode head : lists) if (head != null) pq.offer(head);'},
  {id:'h-dummy',text:'    ListNode dummy = new ListNode(), cur = dummy;'},
  {id:'h-loop',text:'    while (!pq.isEmpty()) {'},
  {id:'h-poll',text:'      ListNode node = pq.poll();'},
  {id:'h-link',text:'      cur.next = node; cur = cur.next;'},
  {id:'h-offer',text:'      if (node.next != null) pq.offer(node.next);'},
  {id:'h-loop-end',text:'    }'},
  {id:'h-return',text:'    return dummy.next;'},
  {id:'h-method-end',text:'  }'},
  {id:'h-class-end',text:'}'},
]

const recursiveCode:CodeLine[] = [
  {id:'r-class',text:'class Solution {'},
  {id:'r-method',text:'  public ListNode mergeKLists(ListNode[] lists) {'},
  {id:'r-empty',text:'    if (lists.length == 0) return null;'},
  {id:'r-call',text:'    return merge(lists, 0, lists.length - 1);'},
  {id:'r-method-end',text:'  }'},
  {id:'r-divide',text:'  private ListNode merge(ListNode[] lists, int left, int right) {'},
  {id:'r-base',text:'    if (left == right) return lists[left];'},
  {id:'r-mid',text:'    int mid = left + (right - left) / 2;'},
  {id:'r-left',text:'    ListNode a = merge(lists, left, mid);'},
  {id:'r-right',text:'    ListNode b = merge(lists, mid + 1, right);'},
  {id:'r-merge',text:'    return mergeTwoLists(a, b);'},
  {id:'r-divide-end',text:'  }'},
  ...mergeHelper,
  {id:'r-class-end',text:'}'},
]

const iterativeCode:CodeLine[] = [
  {id:'i-class',text:'class Solution {'},
  {id:'i-method',text:'  public ListNode mergeKLists(ListNode[] lists) {'},
  {id:'i-step',text:'    for (int step = 1; step < lists.length; step *= 2) {'},
  {id:'i-loop',text:'      for (int i = 0; i + step < lists.length; i += step * 2) {'},
  {id:'i-merge',text:'        lists[i] = mergeTwoLists(lists[i], lists[i + step]);'},
  {id:'i-loop-end',text:'      }'},
  {id:'i-step-end',text:'    }'},
  {id:'i-return',text:'    return lists.length == 0 ? null : lists[0];'},
  {id:'i-method-end',text:'  }'},
  ...mergeHelper,
  {id:'i-class-end',text:'}'},
]

const input:(number[]|null)[]=[[1,4,5],[1,3,4],[2,6]]
const answer=[1,1,2,3,4,4,5,6]

const heapSteps:MergeKStep[]=[
 {phase:'input',lists:input,heap:[],result:[],lineId:'h-method',message:'输入有 3 条升序链表；堆中只需要放每条链表当前的头节点'},
 {phase:'heap',lists:input,heap:[{value:1,source:0},{value:1,source:1},{value:2,source:2}],result:[],lineId:'h-init',message:'把三条链表的头节点 1、1、2 加入最小堆，并保留各自来源'},
 {phase:'pop',lists:[[4,5],[1,3,4],[2,6]],heap:[{value:1,source:1},{value:2,source:2},{value:4,source:0}],result:[1],lineId:'h-offer',message:'弹出 list 0 的 1 接到结果，再把它的 next=4 放入堆'},
 {phase:'pop',lists:[[4,5],[3,4],[2,6]],heap:[{value:2,source:2},{value:3,source:1},{value:4,source:0}],result:[1,1],lineId:'h-offer',message:'弹出 list 1 的 1；同一来源向后推进，把 3 放入堆'},
 {phase:'pop',lists:[[4,5],[3,4],[6]],heap:[{value:3,source:1},{value:4,source:0},{value:6,source:2}],result:[1,1,2],lineId:'h-poll',message:'堆顶 2 最小，接到结果；下一候选 6 入堆'},
 {phase:'done',lists:[answer,null,null],heap:[],result:answer,lineId:'h-return',message:'不断重复“弹出最小值 + 将 next 入堆”，得到完整升序链表'},
]

const recursiveSteps:MergeKStep[]=[
 {phase:'input',lists:input,heap:[],result:[],range:'[0,2]',lineId:'r-call',message:'递归处理整个区间 [0,2]'},
 {phase:'split',lists:input,heap:[],result:[],range:'[0,1] + [2,2]',lineId:'r-mid',message:'mid=1，把三条链表拆成区间 [0,1] 与 [2,2]'},
 {phase:'split',lists:input,heap:[],result:[],range:'[0,0] + [1,1]',lineId:'r-left',message:'继续拆分 [0,1]；单个槽位命中递归边界'},
 {phase:'merge',lists:[[1,1,3,4,4,5],null,[2,6]],heap:[],result:[1,1,3,4,4,5],range:'merge(0,1)',lineId:'r-merge',message:'回升合并 list 0 与 list 1，得到 [1,1,3,4,4,5]'},
 {phase:'merge',lists:[answer,null,null],heap:[],result:answer,range:'merge(0..1,2)',lineId:'x-pick',message:'再与 list 2 合并；每层只做标准的两个有序链表归并'},
 {phase:'done',lists:[answer,null,null],heap:[],result:answer,range:'[0,2]',lineId:'r-merge',message:'递归分治完成，总共经历 log K 层归并'},
]

const iterativeSteps:MergeKStep[]=[
 {phase:'input',lists:input,heap:[],result:[],stepSize:0,lineId:'i-method',message:'把每条链表看作一个槽位，准备按间隔 step 两两合并'},
 {phase:'merge',lists:[[1,1,3,4,4,5],null,[2,6]],heap:[],result:[1,1,3,4,4,5],stepSize:1,lineId:'i-merge',message:'step=1：合并槽位 0 与 1；槽位 2 暂时保留'},
 {phase:'merge',lists:[answer,null,null],heap:[],result:answer,stepSize:2,lineId:'i-step',message:'step*=2 变为 2：合并槽位 0 与 2，得到最终链表'},
 {phase:'done',lists:[answer,null,null],heap:[],result:answer,stepSize:4,lineId:'i-return',message:'step=4 不再小于 K=3；返回 lists[0]，额外空间 O(1)'},
]

export function getMergeKCode(method:MergeKMethod){return method==='heap'?heapCode:method==='recursive'?recursiveCode:iterativeCode}
export function getMergeKSteps(method:MergeKMethod){return method==='heap'?heapSteps:method==='recursive'?recursiveSteps:iterativeSteps}

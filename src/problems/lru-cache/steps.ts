import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type LruMethod = 'manual' | 'linked-map'
export interface LruStep { operation:string; order:number[]; values:Record<number,number>; result:string; active:number|null; evicted:number|null; phase:'init'|'hit'|'miss'|'put'|'evict'|'done'; lineId:string; message:string }

export const lruMethods:PlayerMethod[] = [
  { id:'manual', label:'Map + 循环双向链表', complexity:'O(1) · O(capacity)', languages:['java'] },
  { id:'linked-map', label:'LinkedHashMap', complexity:'O(1) · O(capacity)', languages:['java'] },
]

const manualCode:CodeLine[] = [
  {id:'m-import',text:'import java.util.*;'},
  {id:'m-class',text:'class LRUCache {'},
  {id:'m-node',text:'  private static class Node {'},
  {id:'m-fields',text:'    int key, value; Node prev, next;'},
  {id:'m-node-ctor',text:'    Node(int key, int value) { this.key = key; this.value = value; }'},
  {id:'m-node-end',text:'  }'},
  {id:'m-capacity',text:'  private final int capacity;'},
  {id:'m-map',text:'  private final Map<Integer, Node> keyToNode = new HashMap<>();'},
  {id:'m-dummy',text:'  private final Node dummy = new Node(0, 0);'},
  {id:'m-ctor',text:'  public LRUCache(int capacity) {'},
  {id:'m-set-capacity',text:'    this.capacity = capacity;'},
  {id:'m-circle',text:'    dummy.prev = dummy; dummy.next = dummy;'},
  {id:'m-ctor-end',text:'  }'},
  {id:'m-get',text:'  public int get(int key) {'},
  {id:'m-get-node-call',text:'    Node node = getNode(key);'},
  {id:'m-get-return',text:'    return node == null ? -1 : node.value;'},
  {id:'m-get-end',text:'  }'},
  {id:'m-put',text:'  public void put(int key, int value) {'},
  {id:'m-put-get',text:'    Node node = getNode(key);'},
  {id:'m-update',text:'    if (node != null) { node.value = value; return; }'},
  {id:'m-new',text:'    node = new Node(key, value);'},
  {id:'m-map-set',text:'    keyToNode.put(key, node);'},
  {id:'m-front',text:'    pushFront(node);'},
  {id:'m-over',text:'    if (keyToNode.size() > capacity) {'},
  {id:'m-back',text:'      Node backNode = dummy.prev;'},
  {id:'m-delete',text:'      keyToNode.remove(backNode.key);'},
  {id:'m-remove-back',text:'      remove(backNode);'},
  {id:'m-over-end',text:'    }'},
  {id:'m-put-end',text:'  }'},
  {id:'m-get-node',text:'  private Node getNode(int key) {'},
  {id:'m-missing',text:'    if (!keyToNode.containsKey(key)) return null;'},
  {id:'m-found',text:'    Node node = keyToNode.get(key);'},
  {id:'m-promote',text:'    remove(node); pushFront(node);'},
  {id:'m-node-return',text:'    return node;'},
  {id:'m-get-node-end',text:'  }'},
  {id:'m-remove',text:'  private void remove(Node x) {'},
  {id:'m-remove-body',text:'    x.prev.next = x.next; x.next.prev = x.prev;'},
  {id:'m-remove-end',text:'  }'},
  {id:'m-push',text:'  private void pushFront(Node x) {'},
  {id:'m-push-body',text:'    x.prev = dummy; x.next = dummy.next;'},
  {id:'m-push-link',text:'    x.prev.next = x; x.next.prev = x;'},
  {id:'m-push-end',text:'  }'},
  {id:'m-class-end',text:'}'},
]

const linkedMapCode:CodeLine[] = [
  {id:'l-import',text:'import java.util.*;'},
  {id:'l-class',text:'class LRUCache extends LinkedHashMap<Integer, Integer> {'},
  {id:'l-capacity',text:'  private final int capacity;'},
  {id:'l-ctor',text:'  public LRUCache(int capacity) {'},
  {id:'l-super',text:'    super(capacity, 0.75f, true);'},
  {id:'l-set-capacity',text:'    this.capacity = capacity;'},
  {id:'l-ctor-end',text:'  }'},
  {id:'l-get',text:'  public int get(int key) {'},
  {id:'l-get-return',text:'    return super.getOrDefault(key, -1);'},
  {id:'l-get-end',text:'  }'},
  {id:'l-put',text:'  public void put(int key, int value) {'},
  {id:'l-put-body',text:'    super.put(key, value);'},
  {id:'l-put-end',text:'  }'},
  {id:'l-evict',text:'  protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {'},
  {id:'l-evict-return',text:'    return size() > capacity;'},
  {id:'l-evict-end',text:'  }'},
  {id:'l-class-end',text:'}'},
]

const base = [
  {operation:'LRUCache(2)',order:[],values:{},result:'null',active:null,evicted:null,phase:'init',manual:'m-ctor',linked:'l-ctor',message:'初始化容量为 2 的缓存；访问顺序表为空'},
  {operation:'put(1, 1)',order:[1],values:{1:1},result:'null',active:1,evicted:null,phase:'put',manual:'m-front',linked:'l-put-body',message:'写入 key 1，并把它放到最近使用端'},
  {operation:'put(2, 2)',order:[2,1],values:{1:1,2:2},result:'null',active:2,evicted:null,phase:'put',manual:'m-front',linked:'l-put-body',message:'写入 key 2；顺序更新为 2（最新）→ 1（最旧）'},
  {operation:'get(1)',order:[1,2],values:{1:1,2:2},result:'1',active:1,evicted:null,phase:'hit',manual:'m-promote',linked:'l-get-return',message:'命中 key 1，返回 1；一次访问会把 key 1 提升到最近使用端'},
  {operation:'put(3, 3)',order:[3,1],values:{1:1,3:3},result:'null',active:3,evicted:2,phase:'evict',manual:'m-delete',linked:'l-evict-return',message:'插入 key 3 后容量超限，淘汰最久未使用的 key 2'},
  {operation:'get(2)',order:[3,1],values:{1:1,3:3},result:'-1',active:2,evicted:null,phase:'miss',manual:'m-missing',linked:'l-get-return',message:'key 2 已被淘汰，返回 -1；访问顺序不变'},
  {operation:'put(4, 4)',order:[4,3],values:{3:3,4:4},result:'null',active:4,evicted:1,phase:'evict',manual:'m-remove-back',linked:'l-evict-return',message:'插入 key 4，淘汰 LRU 端的 key 1'},
  {operation:'get(1)',order:[4,3],values:{3:3,4:4},result:'-1',active:1,evicted:null,phase:'miss',manual:'m-get-return',linked:'l-get-return',message:'key 1 不在缓存，返回 -1'},
  {operation:'get(3)',order:[3,4],values:{3:3,4:4},result:'3',active:3,evicted:null,phase:'hit',manual:'m-promote',linked:'l-get-return',message:'命中 key 3，并把它移动到 MRU 端'},
  {operation:'get(4)',order:[4,3],values:{3:3,4:4},result:'4',active:4,evicted:null,phase:'done',manual:'m-get-return',linked:'l-get-return',message:'命中 key 4；最终顺序为 4（最新）→ 3（最旧）'},
] as const

export function getLruCode(method:LruMethod){ return method === 'manual' ? manualCode : linkedMapCode }
export function getLruSteps(method:LruMethod):LruStep[]{
  return base.map(step=>({operation:step.operation,order:[...step.order],values:{...step.values},result:step.result,active:step.active,evicted:step.evicted,phase:step.phase,lineId:method==='manual'?step.manual:step.linked,message:step.message}))
}

import { java, recorder, type LessonRow, type TreeLesson } from '../tree-lessons/model'

const arrayCode = java(`
import java.util.*;
class Solution {
  public List<List<Integer>> levelOrder(TreeNode root) {
@empty|    if (root == null) return List.of();
    List<List<Integer>> ans = new ArrayList<>();
@init|    List<TreeNode> cur = List.of(root);
@loop|    while (!cur.isEmpty()) {
@next|      List<TreeNode> nxt = new ArrayList<>();
      List<Integer> vals = new ArrayList<>(cur.size());
@node|      for (TreeNode node : cur) {
@value|        vals.add(node.val);
@left|        if (node.left != null) nxt.add(node.left);
@right|        if (node.right != null) nxt.add(node.right);
      }
@advance|      cur = nxt;
@record|      ans.add(vals);
    }
@return|    return ans;
  }
}`)
const queueCode = java(`
import java.util.*;
class Solution {
  public List<List<Integer>> levelOrder(TreeNode root) {
@empty|    if (root == null) return List.of();
    List<List<Integer>> ans = new ArrayList<>();
    Queue<TreeNode> q = new ArrayDeque<>();
@init|    q.add(root);
@loop|    while (!q.isEmpty()) {
@size|      int n = q.size();
      List<Integer> vals = new ArrayList<>(n);
@count|      while (n-- > 0) {
@node|        TreeNode node = q.poll();
@value|        vals.add(node.val);
@left|        if (node.left != null) q.add(node.left);
@right|        if (node.right != null) q.add(node.right);
      }
@record|      ans.add(vals);
    }
@return|    return ans;
  }
}`)

export const levelOrderLesson: TreeLesson = {
  methods: [
    { id: 'arrays', label: '两个数组分层', complexity: 'O(N) · O(N)', languages: ['java'], code: arrayCode },
    { id: 'queue', label: '一个队列分层', complexity: 'O(N) · O(N)', languages: ['java'], code: queueCode },
  ],
  scenarios: [
    { id: 'sample', label: '示例 [3,9,20,null,null,15,7]', input: [3,9,20,null,null,15,7] },
    { id: 'one', label: '单个节点', input: [1] },
    { id: 'empty', label: '空树', input: [] },
  ],
  legend: '蓝色：正在访问。绿色：已经记录。每层从左到右，vals 收齐本层后才加入 ans。',
  makeFrames(method, scenario) {
    const r = recorder(scenario.input)
    if (r.root === null) {
      r.push('empty', '空树返回空列表', 'root == null，直接返回 []，不会创建任何层。', { done: true, rows: [{ label: 'ans', items: [] }] })
      return r.frames
    }
    const arrays = method === 'arrays'
    let cur = [r.root], nxt: number[] = [], queue = [r.root], vals: number[] = []
    const ans: number[][] = []
    let level = 0, remaining = 0
    const rows = (): LessonRow[] => [
      ...(arrays ? [{ label: 'cur：本层节点', items: cur.map(r.name), tone: 'blue' as const }, { label: 'nxt：下一层节点', items: nxt.map(r.name), tone: 'orange' as const }] : [{ label: 'q：队首 → 队尾', items: queue.map(r.name), tone: 'orange' as const }]),
      { label: 'vals：本层已取出的值', items: vals.map(String), tone: 'blue' },
      { label: 'ans：已完成的层', items: ans.map(layer => `[${layer.join(',')}]`), tone: 'green' },
    ]
    const variables = (): [string,string][] => [['当前层', String(level)], ...(arrays ? [] : [['本层剩余 n', String(remaining)] as [string,string]])]
    const push = (id: string, title: string, message: string, active: number[] = []) => r.push(id,title,message,{ active, variables: variables(), rows: rows() })
    push('init', '从根节点开始', arrays ? 'cur = [root]，第一层只有根节点。' : '根节点入队；FIFO 保证先发现的节点先访问。')
    while (arrays ? cur.length : queue.length) {
      level++
      vals = []
      nxt = []
      const batch = arrays ? [...cur] : [...queue]
      remaining = batch.length
      push(arrays ? 'next' : 'size', `第 ${level} 层开始`, arrays ? `创建空 nxt 和 vals；本层 cur 有 ${batch.length} 个节点。` : `n = q.size() = ${remaining}，固定本层数量。之后入队的孩子属于下一层。`)
      for (const id of batch) {
        if (!arrays) { remaining--; queue = queue.slice(1) }
        r.stack.splice(0,r.stack.length, `第 ${level} 层 · node=${r.name(id)}`)
        push('node', '取出本层的一个节点', arrays ? `从 cur 依次取出 ${r.name(id)}。` : `n-- 后剩 ${remaining} 个本层任务；q.poll() 取出 ${r.name(id)}。`, [id])
        vals.push(r.nodes[id].value)
        r.completed.push(id)
        push('value', '将节点值写入 vals', `vals.add(${r.name(id)})，当前层结果为 [${vals.join(',')}]。`, [id])
        for (const side of ['left','right'] as const) {
          const child = r.nodes[id][side]
          if (child !== null) {
            if (arrays) nxt.push(child)
            else queue.push(child)
          }
          push(side, side === 'left' ? '检查左孩子' : '检查右孩子', child === null ? `${r.name(id)} 的${side === 'left' ? '左' : '右'}孩子是 null，不加入${arrays ? ' nxt' : '队列'}。` : `${r.name(child)} 加入 ${arrays ? 'nxt' : '队尾'}，将在下一层处理。`, child === null ? [id] : [id,child])
        }
      }
      if (arrays) { cur = [...nxt]; push('advance', '切换到下一层', 'cur = nxt；本层 vals 已保存好，接下来将它加入答案。') }
      ans.push([...vals])
      push('record', '一整层加入 ans', `ans.add(vals)，得到 ${JSON.stringify(ans)}。${arrays ? '' : '本层 n 个节点已经全部出队。'}`)
    }
    r.stack.length = 0
    r.push('return', '层序遍历完成', `所有节点只访问一次，返回 ${JSON.stringify(ans)}。`, { done: true, rows: rows(), variables: [['层数', String(level)]] })
    return r.frames
  },
}

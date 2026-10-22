import { java, recorder, type TreeLesson } from '../tree-lessons/model'

const recursive = java(`
class Solution {
  public boolean isSymmetric(TreeNode root) {
@start|    return root == null || isSameTree(root.left, root.right);
  }
  private boolean isSameTree(TreeNode p, TreeNode q) {
@base|    if (p == null || q == null) return p == q;
@value|    return p.val == q.val &&
@outer|        isSameTree(p.left, q.right) &&
@inner|        isSameTree(p.right, q.left);
  }
}`)
const iterative = java(`
import java.util.*;
class Solution {
  public boolean isSymmetric(TreeNode root) {
@empty|    if (root == null) return true;
    Queue<TreeNode[]> queue = new ArrayDeque<>();
@init|    queue.add(new TreeNode[]{root.left, root.right});
    while (!queue.isEmpty()) {
@poll|      TreeNode[] pair = queue.poll();
      TreeNode p = pair[0], q = pair[1];
@base|      if (p == null || q == null) {
@null-fail|        if (p != q) return false;
        continue;
      }
@value|      if (p.val != q.val) return false;
@outer|      queue.add(new TreeNode[]{p.left, q.right});
@inner|      queue.add(new TreeNode[]{p.right, q.left});
    }
@return|    return true;
  }
}`)

export const symmetricLesson: TreeLesson = {
  methods: [
    { id: 'recursive', label: '递归镜像比较', complexity: 'O(N) · O(H)', languages: ['java'], code: recursive },
    { id: 'queue', label: '迭代成对比较', complexity: 'O(N) · O(N)', languages: ['java'], code: iterative },
  ],
  scenarios: [
    { id: 'yes', label: '对称：重复值但不同节点', input: [1,2,2,3,4,4,3] },
    { id: 'no', label: '反例：数值相同，位置不镜像', input: [1,2,2,null,3,null,3] },
  ],
  legend: '蓝色的两个节点是一对镜像位置。必须比较外侧与外侧、内侧与内侧。',
  makeFrames(method, scenario) {
    const r = recorder(scenario.input)
    const pairName = (p: number | null, q: number | null) => `(${r.name(p)}, ${r.name(q)})`
    const vars = (p: number | null, q: number | null): [string,string][] => [['p', r.name(p)], ['q', r.name(q)], ['身份', `node ${p ?? 'null'} / node ${q ?? 'null'}`]]
    const active = (p: number | null, q: number | null) => [p,q].filter((id): id is number => id !== null)
    const root = r.nodes[0]
    let answer = true
    if (method === 'recursive') {
      r.push('start', '将左右子树配成一对', '根节点无需和自己比较，从左孩子与右孩子开始判断镜像。')
      const compare = (p: number | null, q: number | null): boolean => {
        r.stack.push(`isSameTree${pairName(p,q)}`)
        r.push('base', '检查空节点', `比较 ${pairName(p,q)}：两个都空才匹配，只有一侧为空则不对称。`, { active: active(p,q), variables: vars(p,q) })
        if (p === null || q === null) {
          const same = p === q
          r.push('base', same ? '空位置镜像一致' : '一侧缺少节点', `p == q 为 ${same}，返回 ${same}。`, { active: active(p,q), variables: vars(p,q), failed: !same })
          r.stack.pop()
          return same
        }
        const same = r.nodes[p].value === r.nodes[q].value
        r.push('value', '比较节点值', `${r.name(p)} == ${r.name(q)} 为 ${same}${same ? '，继续交叉比较孩子。' : '，短路返回 false。'}`, { active: [p,q], variables: vars(p,q), failed: !same })
        if (!same) { r.stack.pop(); return false }
        r.push('outer', '比较外侧孩子', '下一对子问题是 p.left 与 q.right，镜像的左右方向必须相反。', { active: [p,q], variables: vars(p,q) })
        const outer = compare(r.nodes[p].left, r.nodes[q].right)
        if (!outer) { r.stack.pop(); return false }
        r.push('inner', '比较内侧孩子', '外侧已经匹配，继续比较 p.right 与 q.left。', { active: [p,q], variables: vars(p,q) })
        const inner = compare(r.nodes[p].right, r.nodes[q].left)
        if (inner) r.completed.push(p,q)
        r.stack.pop()
        return inner
      }
      answer = compare(root.left,root.right)
    } else {
      const queue: [number|null,number|null][] = [[root.left,root.right]]
      const rows = () => [{ label: '待比较的节点对（队首 → 队尾）', items: queue.map(([p,q]) => pairName(p,q)), tone: 'orange' as const }]
      r.push('init', '先加入根节点的左右孩子', '队列中保存的是成对任务；数组可以保存 null，队列本身没有放入 null 元素。', { rows: rows() })
      while (queue.length) {
        const [p,q] = queue.shift()!
        r.push('poll', '取出一对镜像位置', `从队首取出 ${pairName(p,q)}。`, { active: active(p,q), variables: vars(p,q), rows: rows() })
        if (p === null || q === null) {
          answer = p === q
          r.push(answer ? 'base' : 'null-fail', answer ? '两个空节点匹配' : '仅一侧为空', `p == q 为 ${answer}${answer ? '，继续下一对。' : '，立即返回 false。'}`, { variables: vars(p,q), active: active(p,q), rows: rows(), failed: !answer })
          if (!answer) break
          continue
        }
        answer = r.nodes[p].value === r.nodes[q].value
        r.push('value', '比较当前节点值', `${r.name(p)} == ${r.name(q)} 为 ${answer}。`, { active: [p,q], variables: vars(p,q), rows: rows(), failed: !answer })
        if (!answer) break
        queue.push([r.nodes[p].left,r.nodes[q].right])
        r.push('outer', '外侧节点成对入队', '加入 (p.left, q.right)。', { active: [p,q], rows: rows() })
        queue.push([r.nodes[p].right,r.nodes[q].left])
        r.completed.push(p,q)
        r.push('inner', '内侧节点成对入队', '加入 (p.right, q.left)，等待依次检查。', { active: [p,q], rows: rows() })
      }
    }
    r.push(method === 'recursive' ? 'start' : answer ? 'return' : 'null-fail', `返回 ${answer}`, answer ? '所有镜像位置均匹配，这棵树轴对称。' : '发现一对不匹配的镜像位置，整棵树不对称。', { done: true, failed: !answer, variables: [['答案', String(answer)]] })
    return r.frames
  },
}

import { java, recorder, type TreeLesson } from '../tree-lessons/model'

function code(edges: boolean) {
  return java(`
class Solution {
  private int ans;
  public int diameterOfBinaryTree(TreeNode root) {
@init|    ans = 0;
@start|    dfs(root);
@answer|    return ans;
  }
  private int dfs(TreeNode node) {
@base|    if (node == null) return ${edges ? '-1' : '0'};
@left|    int lLen = dfs(node.left)${edges ? ' + 1' : ''};
@right|    int rLen = dfs(node.right)${edges ? ' + 1' : ''};
@update|    ans = Math.max(ans, lLen + rLen);
@return|    return Math.max(lLen, rLen)${edges ? '' : ' + 1'};
  }
}`)
}

export const diameterLesson: TreeLesson = {
  methods: [
    { id: 'edges', label: '链长按边计数', complexity: 'O(N) · O(H)', languages: ['java'], code: code(true) },
    { id: 'height', label: '返回子树高度', complexity: 'O(N) · O(H)', languages: ['java'], code: code(false) },
  ],
  scenarios: [
    { id: 'sample', label: '示例：直径 3 条边', input: [1,2,3,4,5] },
    { id: 'below', label: '反例：最长路径不经过根', input: [1,2,null,3,4,5,null,null,6] },
    { id: 'two', label: '两个节点：直径 1', input: [1,2] },
  ],
  legend: '橙色连线：目前找到的最长路径。ans 是两条链之和，dfs 只向上返回一条链。',
  makeFrames(method, scenario) {
    const edges = method === 'edges'
    const r = recorder(scenario.input)
    let ans = 0
    let bestPath: number[] = []
    const results: string[] = []
    r.push('init', '初始化全局直径', 'ans = 0；直径按边数计算，只有一个节点的路径长度为 0。', { variables: [['ans', '0']] })
    const dfs = (id: number | null): { length: number; chain: number[] } => {
      r.stack.push(`dfs(${r.name(id)})`)
      if (id === null) {
        r.push('base', '空子树返回', edges ? '空节点返回 -1；父节点再加 1，空方向的链长恰好变为 0。' : '空节点返回高度 0；父节点可以直接用它作为该方向的边长。', { path: [...bestPath], variables: [['返回值', edges ? '-1' : '0'], ['ans', String(ans)]] })
        r.stack.pop()
        return { length: edges ? -1 : 0, chain: [] }
      }
      const node = r.nodes[id]
      r.push('left', `节点 ${node.value}：先算左链`, `递归计算 ${node.value} 的左子树；当前调用留在栈中等待结果。`, { active: [id], path: [...bestPath] })
      const left = dfs(node.left)
      const lLen = left.length + (edges ? 1 : 0)
      r.push('left', '左侧返回并得到 lLen', edges ? `lLen = dfs(left) + 1 = ${left.length} + 1 = ${lLen}。` : `左子树高度为 ${left.length}，从当前节点向左的最长链有 ${lLen} 条边。`, { active: [id], path: [...bestPath], variables: [['lLen', String(lLen)], ['ans', String(ans)]] })
      r.push('right', '继续计算右侧', '左链已保存，再递归求右子树的结果。', { active: [id], path: [...bestPath], variables: [['lLen', String(lLen)]] })
      const right = dfs(node.right)
      const rLen = right.length + (edges ? 1 : 0)
      r.push('right', '右侧返回并得到 rLen', edges ? `rLen = dfs(right) + 1 = ${right.length} + 1 = ${rLen}。` : `右子树高度为 ${right.length}，当前节点向右的最长链有 ${rLen} 条边。`, { active: [id], variables: [['lLen', String(lLen)], ['rLen', String(rLen)], ['ans', String(ans)]], path: [...bestPath] })
      const candidate = lLen + rLen
      const before = ans
      if (candidate >= ans) {
        ans = candidate
        bestPath = [...left.chain].reverse().concat(id, right.chain)
      }
      r.push('update', '两条链在当前节点拼接', `经过节点 ${node.value} 的路径 = ${lLen} + ${rLen} = ${candidate} 条边；ans = max(${before}, ${candidate}) = ${ans}。`, { active: [id], path: [...bestPath], variables: [['lLen', String(lLen)], ['rLen', String(rLen)], ['本次路径', `${lLen} + ${rLen} = ${candidate}`], ['ans', String(ans)]] })
      const length = Math.max(lLen,rLen) + (edges ? 0 : 1)
      const chain = [id, ...(left.length >= right.length ? left.chain : right.chain)]
      r.completed.push(id)
      results.push(`${node.value} → ${length}`)
      r.push('return', '只把较长的一侧返回给父节点', `dfs(${node.value}) 返回 max(${lLen}, ${rLen})${edges ? '' : ' + 1'} = ${length}。${edges ? '这是从当前节点向下的最长单链边数。' : '这是当前子树高度（按节点数计）。'}不能把两条链的和继续向上拼。`, { active: [id], path: [...bestPath], variables: [['返回单链', String(length)], ['ans', String(ans)]], rows: [{ label: '已返回：节点 → dfs 值', items: [...results], tone: 'green' }] })
      r.stack.pop()
      return { length, chain }
    }
    dfs(r.root)
    r.push('answer', `返回直径 ${ans}`, `最长路径包含 ${bestPath.length} 个节点、${ans} 条边。路径可以在任意节点拐弯，不要求经过根。`, { done: true, path: bestPath, variables: [['ans（边数）', String(ans)]], rows: [{ label: '最长路径', items: bestPath.map(r.name), tone: 'orange' }] })
    return r.frames
  },
}
